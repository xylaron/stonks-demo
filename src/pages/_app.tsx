import Footer from "components/Footer";
import { type AppType } from "next/dist/shared/lib/utils";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import "styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();

  return (
    <>
      <Toaster />
      {router.pathname !== "/login" && <Footer />}
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
