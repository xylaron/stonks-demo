import Head from "next/head";
import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { db } from "firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import firebase_app from "firebase/config";
import { type NextPage } from "next";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const Welcome: NextPage = () => {
  const router = useRouter();
  const auth = getAuth(firebase_app);
  const usernameRegex = /^[a-zA-Z0-9_.-]*$/;

  const [username, setUsername] = useState<string>("");

  const handleSubmit = () => {
    if (username.length === 0 || username.length > 20) {
      toast.error("Please enter a username between 1 and 20 characters.");
      return;
    }

    if (!usernameRegex.test(username)) {
      toast.error(
        "Please enter a username containing only letters, numbers, underscores, dashes, and periods."
      );
      return;
    }

    const docRef = doc(db, "users", auth.currentUser!.uid);

    void Promise.all([
      updateDoc(docRef, {
        username: username,
      }),
      updateProfile(auth.currentUser!, {
        displayName: username,
      }),
    ])
      .then(() => {
        toast.success("Username set!");
        void router.push("/");
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
        console.error(err);
      });
  };

  return (
    <>
      <Head>
        <title>Stonks Demo</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-extrabold text-white">
            Welcome to <span>Stonks</span>
          </h1>
          <div className="flex flex-col items-center justify-center rounded-3xl bg-neutral-800 px-4 py-16 font-medium shadow-md shadow-neutral-900">
            <div className="m-8 text-xl">What should we call you?</div>
            <input
              type="tel"
              className="m-8 rounded-lg bg-neutral-700 p-2 text-center text-xl shadow-md"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <button
              className="m-8 mb-2 rounded-lg bg-blue-600 px-12 py-2 shadow-md active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Welcome;
