import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import firebase_app, { db } from "firebase/config";
import { getAuth } from "firebase/auth";
import { toast } from "react-hot-toast";

interface Favourite {
  name: string;
  symbol: string;
}

const Portfolio: NextPage = () => {
  const auth = getAuth(firebase_app);

  const [favourites, setFavourites] = useState<Favourite[]>([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        const favourites = docSnap.data()?.favourites || [];

        //sort favourites alphabetically by symbol
        favourites.sort((a: Favourite, b: Favourite) =>
          a.symbol.localeCompare(b.symbol)
        );

        setFavourites(favourites);
      }
    };
    fetchFavourites();
    console.log("fetching");
  }, [auth]);

  const removeFavourite = async (symbol: string, name: string) => {
    const docRef = doc(db, "users", auth.currentUser!.uid);
    const docSnap = await getDoc(docRef);

    const favourites = docSnap.data()?.favourites || [];

    const newFavourites = favourites.filter(
      (fav: Favourite) => fav.symbol !== symbol
    );
    await updateDoc(docRef, { favourites: newFavourites }).catch((err) => {
      toast.error("Something went wrong. Please try again.");
    });
    newFavourites.sort((a: Favourite, b: Favourite) =>
      a.symbol.localeCompare(b.symbol)
    );
    setFavourites(newFavourites);
  };

  return (
    <>
      <Head>
        <title>Portfolio - Stonks Demo</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
          <div className="w-full px-2 text-4xl font-extrabold">Portfolio</div>
          {favourites?.length > 0 && (
            <div className="w-full px-2">
              {favourites.map(({ name, symbol }, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-neutral-600 p-2"
                >
                  <div>
                    <div className="font-semibold">{symbol}</div>
                    <div className="text-sm text-neutral-500">{name}</div>
                  </div>
                  {favourites.find(
                    (fav: Favourite) => fav.symbol === symbol
                  ) ? (
                    <IoIosStar
                      onClick={() => removeFavourite(symbol, name)}
                      color="yellow"
                      size={20}
                    />
                  ) : (
                    <IoIosStarOutline
                      size={20}
                      onClick={() => removeFavourite(symbol, name)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Portfolio;
