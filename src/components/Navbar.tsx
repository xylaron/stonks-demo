import { getAuth } from "firebase/auth";
import firebase_app from "firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { BiSearch, BiBriefcase } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import { useRouter } from "next/router";
import Link from "next/link";

const Navbar: React.FC = () => {
  const auth = getAuth(firebase_app);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  if (loading || !user) {
    return null;
  }

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 bg-neutral-800 py-3">
      <div className="container mx-auto flex items-center justify-evenly text-sm font-semibold">
        <Link
          href="/"
          className={
            router.pathname === "/"
              ? "flex w-full flex-col items-center text-blue-400"
              : "flex w-full flex-col items-center"
          }
        >
          <AiOutlineHome
            size={16}
            className={router.pathname === "/" ? "text-blue-400" : ""}
          />
          Home
        </Link>
        <Link
          href="/search"
          className={
            router.pathname === "/search"
              ? "flex w-full flex-col items-center text-blue-400"
              : "flex w-full flex-col items-center"
          }
        >
          <BiSearch
            size={16}
            className={router.pathname === "/search" ? "text-blue-400" : ""}
          />
          Search
        </Link>

        <Link
          href="/portfolio"
          className={
            router.pathname === "/portfolio"
              ? "flex w-full flex-col items-center  text-blue-400"
              : "flex w-full flex-col items-center"
          }
        >
          <BiBriefcase
            size={16}
            className={router.pathname === "/portfolio" ? "text-blue-400" : ""}
          />
          Portfolio
        </Link>
      </div>
    </footer>
  );
};

export default Navbar;
