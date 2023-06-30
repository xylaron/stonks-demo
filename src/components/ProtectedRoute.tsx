import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import firebase_app from "../firebase/config";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const auth = getAuth(firebase_app);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      void router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold">
            <span>Stonks</span> Demo
          </h1>
        </div>
      </main>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
