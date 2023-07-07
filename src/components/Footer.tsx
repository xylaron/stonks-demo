import { getAuth } from "firebase/auth";
import firebase_app from "firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { BiSearch, BiBriefcase } from "react-icons/bi";
import { useRouter } from "next/router";
import Link from "next/link";

const Footer: React.FC = () => {
  const auth = getAuth(firebase_app);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  if (loading || !user) {
    return null;
  }

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 bg-neutral-800 py-3">
      <div className="container mx-auto flex items-center justify-evenly gap-16 text-sm font-semibold">
        <div className="flex flex-col items-center">
          <BiSearch
            size={16}
            className={router.pathname === "/search" ? "text-blue-400" : ""}
          />
          <Link
            href="/search"
            className={router.pathname === "/search" ? "text-blue-400" : ""}
          >
            Search
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <BiBriefcase
            size={16}
            className={router.pathname === "/portfolio" ? "text-blue-400" : ""}
          />
          <p
            className={router.pathname === "/portfolio" ? "text-blue-400" : ""}
          >
            Portfolio
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
