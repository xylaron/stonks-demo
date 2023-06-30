import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import firebase_app from "firebase/config";
import ProtectedRoute from "components/ProtectedRoute";

export default function Home() {
  const router = useRouter();
  const auth = getAuth(firebase_app);
  const [user] = useAuthState(auth);

  return (
    <>
      <Head>
        <title>Stonks Demo</title>
      </Head>
      <ProtectedRoute>
        <main className="flex min-h-screen flex-col items-center justify-center">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <h1 className="text-5xl font-extrabold">
              Hello, Welcome to <span>Stonks</span>
            </h1>
            <p className="text-center text-xl font-semibold">
              Logged in as: {user?.phoneNumber}
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
}
