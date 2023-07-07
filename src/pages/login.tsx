import PhoneAuth from "components/PhoneAuth";
import { type NextPage } from "next";
import Head from "next/head";

const Login: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login - Stonks Demo</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-extrabold text-white">
            Login to <span>Stonks</span>
          </h1>
          <PhoneAuth />
        </div>
      </main>
    </>
  );
};

export default Login;
