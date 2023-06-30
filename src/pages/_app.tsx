import Footer from "components/Footer";
import ProtectedRoute from "components/ProtectedRoute";
import { type AppType } from "next/dist/shared/lib/utils";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import "styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  return (
    <>
      <ProtectedRoute>
        <Toaster />
        {router.pathname !== "/login" && <Footer />}
        <Component {...pageProps} />
      </ProtectedRoute>
    </>
  );
};

export default MyApp;
