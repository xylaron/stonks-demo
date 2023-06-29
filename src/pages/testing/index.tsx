import PhoneAuth from "components/PhoneAuth";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Stonks Demo</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold text-white">
            <span className="text-[hsl(280,100%,70%)]">Testing</span> Stuff
          </h1>
          <PhoneAuth />
        </div>
      </main>
    </>
  );
}
