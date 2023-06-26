import { type AppType } from "next/dist/shared/lib/utils";
import "styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="h-3/4 w-[412px] overflow-y-auto overflow-x-hidden bg-white shadow-lg">
        <Component {...pageProps} />
      </div>
    </div>
  );
};

export default MyApp;
