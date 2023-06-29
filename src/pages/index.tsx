import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Stonks Demo</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold text-white">
            <span className="text-[hsl(280,100%,70%)]">Stonks</span> Demo
          </h1>
          <button
            onClick={() => {
              void router.push("/testing");
            }}
            className="rounded-md bg-white px-2 py-1 font-bold"
          >
            Sign In
          </button>
        </div>
      </main>
    </>
  );
}
