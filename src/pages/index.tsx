import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import firebase_app from "firebase/config";
import ProtectedRoute from "components/ProtectedRoute";
import { type NextPage } from "next";

const Home: NextPage = () => {
  const router = useRouter();
  const auth = getAuth(firebase_app);
  const [user] = useAuthState(auth);

  return (
    <>
      <Head>
        <title>Home - Stonks Demo</title>
      </Head>
      <ProtectedRoute>
        <main className="flex min-h-screen flex-col items-center justify-center">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <h1 className="text-5xl font-extrabold">
              Welcome <span>Back</span>
              {"."}
            </h1>
            <p className="text-center text-xl font-semibold">
              Currently logged in as: {user?.displayName}
            </p>
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-white"
              onClick={() => {
                void auth.signOut();
                void router.reload();
              }}
            >
              Logout
            </button>
          </div>
        </main>
      </ProtectedRoute>
    </>
  );
};

export default Home;
