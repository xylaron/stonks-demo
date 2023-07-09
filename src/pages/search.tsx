import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { useQuery } from "react-query";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import firebase_app, { db } from "firebase/config";
import { getAuth } from "firebase/auth";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/router";

interface Result {
  name: string;
  symbol: string;
  assetType: string;
}

interface Favourite {
  name: string;
  symbol: string;
}

const Search: NextPage = () => {
  const auth = getAuth(firebase_app);
  const router = useRouter();

  const [term, setTerm] = useState((router.query.lastSearch as string) || "");
  const [favourites, setFavourites] = useState<Favourite[]>([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        const favourites = (docSnap.data()?.favourites as Favourite[]) || [];
        setFavourites(favourites);
      }
    };
    void fetchFavourites();
  }, [term, auth]);

  const addRemoveFavourite = async (symbol: string, name: string) => {
    const docRef = doc(db, "users", auth.currentUser!.uid);
    const docSnap = await getDoc(docRef);

    const favourites = (docSnap.data()?.favourites as Favourite[]) || [];

    const existingFavourite = favourites.find(
      (fav: Favourite) => fav.symbol === symbol
    );

    if (existingFavourite) {
      const newFavourites = favourites.filter(
        (fav: Favourite) => fav.symbol !== symbol
      );
      await updateDoc(docRef, { favourites: newFavourites }).catch((err) => {
        toast.error("Something went wrong. Please try again.");
        console.error(err);
      });
      setFavourites(newFavourites);
    } else {
      const newFavorite: Favourite = { name, symbol };
      const newFavourites = [...favourites, newFavorite];
      await updateDoc(docRef, { favourites: newFavourites }).catch((err) => {
        toast.error("Something went wrong. Please try again.");
        console.error(err);
      });
      setFavourites(newFavourites);
    }
  };

  const fetchSearchResults = (term: string) =>
    axios.get(`/api/search?term=${term}`).then((res) => res.data as Result[]);

  const {
    data: results,
    isError,
    error,
  } = useQuery(["searchResults", term], () => fetchSearchResults(term), {
    enabled: !!term,
  });

  if (isError) {
    console.error(error);
  }

  return (
    <>
      <Head>
        <title>Search - Stonks Demo</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
          <div className="w-full px-2 text-4xl font-extrabold">Search</div>
          <div className="relative w-full rounded-lg bg-neutral-700 p-2 text-center shadow-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-neutral-500" />
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full bg-transparent pl-10"
              placeholder="Search stocks..."
            />
          </div>
          {results?.length !== 0 && (
            <div className="w-full px-2">
              {results?.map((result: Result, index: number) => (
                <div
                  key={index}
                  className="flex cursor-pointer items-center justify-between border-b border-neutral-600 p-2"
                  onClick={() =>
                    void router.push({
                      pathname: `/stock`,
                      query: {
                        name: result.name,
                        symbol: result.symbol,
                        lastSearch: term,
                      },
                    })
                  }
                >
                  <div>
                    <div className="font-semibold">{result.symbol}</div>
                    <div className="text-sm text-neutral-500">
                      {result.name}
                    </div>
                  </div>
                  {favourites.find(
                    (fav: Favourite) => fav.symbol === result.symbol
                  ) ? (
                    <IoIosStar
                      onClick={(event: React.MouseEvent) => {
                        event.stopPropagation();
                        void addRemoveFavourite(result.symbol, result.name);
                      }}
                      color="yellow"
                      size={20}
                    />
                  ) : (
                    <IoIosStarOutline
                      size={20}
                      onClick={(event: React.MouseEvent) => {
                        event.stopPropagation();
                        void addRemoveFavourite(result.symbol, result.name);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          {results?.length === 0 && term.length > 0 && (
            <div className="w-full text-center text-neutral-500">
              No results found for &quot;{term}&quot;.
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Search;
