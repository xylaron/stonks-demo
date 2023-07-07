import { QueryClient, QueryClientProvider } from "react-query";
import Navbar from "components/Navbar";
import { type AppType } from "next/dist/shared/lib/utils";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import "styles/globals.css";

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        {router.pathname !== "/login" && <Navbar />}
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
