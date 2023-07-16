import { NextPage } from "next";
import type { StockData, NewsData, StockOverview } from "types/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { RxCross2 } from "react-icons/rx";
import LoadingSpin from "components/LoadingSpin";
import toast from "react-hot-toast";

const Stock: NextPage = () => {
  const router = useRouter();

  const [stockGraphPick, setStockGraphPick] = useState(1);

  const {
    data: stockData,
    isLoading: isLoadingStock,
    isError: isErrorStock,
    isFetching: isFetchingStock,
  } = useQuery<StockData>("stock", () => fetchStockData(), {
    refetchOnWindowFocus: false,
  });

  const fetchStockData = () =>
    axios
      .get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${
          router.query.symbol as string
        }&outputsize=full&apikey=${
          process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY as string
        }`
        // `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&outputsize=full&apikey=demo`
      )
      .then((res) => res.data as StockData);

  const {
    data: newsData,
    isLoading: isLoadingNews,
    isError: isErrorNews,
    isFetching: isFetchingNews,
  } = useQuery<NewsData>("news", () => fetchNewsData(), {
    refetchOnWindowFocus: false,
  });

  const fetchNewsData = () =>
    axios
      .get(
        // `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${
        //   router.query.symbol as string
        // }&apikey=${
        //   process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY as string
        // }&limit=10`
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=demo`
      )
      .then((res) => res.data as NewsData);

  const {
    data: stockOverview,
    isLoading: isLoadingOverview,
    isError: isErrorOverview,
    isFetching: isFetchingOverview,
  } = useQuery<StockOverview>("overview", () => fetchOverview(), {
    refetchOnWindowFocus: false,
  });

  const fetchOverview = () =>
    axios
      .get(
        // `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${
        //   router.query.symbol as string
        // }&apikey=${process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY as string}`
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=demo`
      )
      .then((res) => res.data as StockOverview);

  if (
    isLoadingStock ||
    isLoadingNews ||
    isLoadingOverview ||
    isFetchingStock ||
    isFetchingNews ||
    isFetchingOverview
  ) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <LoadingSpin />
      </main>
    );
  }

  if (isErrorStock || isErrorNews || isErrorOverview) {
    void router.push({
      pathname: router.query.lastSearch ? `/search` : `/portfolio`,
      query: { lastSearch: router.query.lastSearch },
    });
    toast.error("An error occurred. Please try again.", {
      id: "api-call-error",
    });
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <LoadingSpin />
      </main>
    );
  }

  if (
    stockData!.Information ||
    newsData!.Information ||
    stockOverview!.Information
  ) {
    void router.push({
      pathname: router.query.lastSearch ? `/search` : `/portfolio`,
      query: { lastSearch: router.query.lastSearch },
    });
    toast.error("Error: Invalid API Call.", {
      id: "api-call-invalid",
    });
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <LoadingSpin />
      </main>
    );
  }

  if (stockData!.Note || newsData!.Note || stockOverview!.Note) {
    void router.push({
      pathname: router.query.lastSearch ? `/search` : `/portfolio`,
      query: { lastSearch: router.query.lastSearch },
    });
    toast.error("Error: API call limit reached. Please try again later.", {
      id: "api-call-limit",
    });
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <LoadingSpin />
      </main>
    );
  }

  const stockGraphPicker =
    isLoadingStock || isErrorStock
      ? []
      : [
          { setting: "1w", range: 7, interval: 1 },
          { setting: "1m", range: 20, interval: 1 },
          { setting: "3m", range: 62, interval: 2 },
          { setting: "6m", range: 124, interval: 3 },
          { setting: "1y", range: 252, interval: 5 },
          { setting: "5y", range: 1258, interval: 7 },
          {
            setting: "all",
            range: undefined,
            interval: 14,
          },
        ];

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };

  const labels = isLoadingStock
    ? []
    : Object.keys(stockData!["Time Series (Daily)"])
        .slice(0, stockGraphPicker[stockGraphPick]!.range)
        .reverse()
        .filter(
          (value, index) =>
            index % stockGraphPicker[stockGraphPick]!.interval === 0
        );

  const data = {
    labels,
    datasets: [
      {
        label: "Closing Price",
        data: isLoadingStock
          ? []
          : Object.values(stockData!["Time Series (Daily)"])
              .slice(0, stockGraphPicker[stockGraphPick]!.range)
              .reverse()
              .filter(
                (value, index) =>
                  index % stockGraphPicker[stockGraphPick]!.interval === 0
              )
              .map((value) => value["5. adjusted close"]),
        pointRadius: 0,
        borderColor: "rgb(37, 99, 235)",
        backgroundColor: "rgba(37, 99, 235, 0.5)",
      },
    ],
  };

  const yesterdayClose = Number(
    Object.values(stockData!["Time Series (Daily)"])[1]!["4. close"]
  );

  const todayClose = Number(
    Object.values(stockData!["Time Series (Daily)"])[0]!["4. close"]
  );

  const changePercent = ((todayClose - yesterdayClose) / yesterdayClose) * 100;

  return (
    <>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center px-4 py-16">
          <div className="w-full border-b border-neutral-600 p-2">
            <div className="flex flex-row justify-between text-4xl font-extrabold">
              <div>{router.query.symbol as string}</div>
              <RxCross2
                onClick={() =>
                  void router.push({
                    pathname: router.query.lastSearch
                      ? `/search`
                      : `/portfolio`,
                    query: { lastSearch: router.query.lastSearch },
                  })
                }
                className="inline-block h-6 w-6 cursor-pointer"
              />
            </div>
            <div className="text-base text-neutral-500">
              {router.query.name}
            </div>
            <div className="flex flex-row items-baseline gap-2">
              <div className="text-2xl">
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(todayClose)}
              </div>
              <div>
                {changePercent > 0 ? (
                  <div className="flex flex-row items-center gap-2 text-green-500">
                    <div className="text-lg font-bold">
                      {changePercent.toFixed(2)}%
                    </div>
                    <div className="text-lg font-bold">▲</div>
                  </div>
                ) : (
                  <div className="flex flex-row items-center gap-2 text-red-500">
                    <div className="text-lg font-bold">
                      {changePercent.toFixed(2)}%
                    </div>
                    <div className="text-lg font-bold">▼</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Graph Pickers */}
          <div className="flex w-full flex-row justify-center gap-4 overflow-auto border-b border-neutral-600 p-2 text-sm">
            {/* <button
              className={
                stockGraphPick === 0
                  ? "rounded-lg bg-blue-600 px-3 py-2 shadow-md"
                  : "rounded-lg px-3 py-2 shadow-md"
              }
              onClick={() => setStockGraphPick(0)}
            >
              1W
            </button> */}
            <button
              className={
                stockGraphPick === 1
                  ? "rounded-lg bg-blue-600 px-3 py-2 shadow-md"
                  : "rounded-lg px-3 py-2 shadow-md"
              }
              onClick={() => setStockGraphPick(1)}
            >
              1M
            </button>
            <button
              className={
                stockGraphPick === 2
                  ? "rounded-lg bg-blue-600 px-3 py-2 shadow-md"
                  : "rounded-lg px-3 py-2 shadow-md"
              }
              onClick={() => setStockGraphPick(2)}
            >
              3M
            </button>
            <button
              className={
                stockGraphPick === 3
                  ? "rounded-lg bg-blue-600 px-3 py-2 shadow-md"
                  : "rounded-lg px-3 py-2 shadow-md"
              }
              onClick={() => setStockGraphPick(3)}
            >
              6M
            </button>
            <button
              className={
                stockGraphPick === 4
                  ? "rounded-lg bg-blue-600 px-3 py-2 shadow-md"
                  : "rounded-lg px-3 py-2 shadow-md"
              }
              onClick={() => setStockGraphPick(4)}
            >
              1Y
            </button>
            <button
              className={
                stockGraphPick === 5
                  ? "rounded-lg bg-blue-600 px-3 py-2 shadow-md"
                  : "rounded-lg px-3 py-2 shadow-md"
              }
              onClick={() => setStockGraphPick(5)}
            >
              5Y
            </button>
            <button
              className={
                stockGraphPick === 6
                  ? "rounded-lg bg-blue-600 px-3 py-2 shadow-md"
                  : "rounded-lg px-3 py-2 shadow-md"
              }
              onClick={() => setStockGraphPick(6)}
            >
              ALL
            </button>
          </div>
          {/* Stock Chart */}
          <Line
            data={data}
            options={options}
            className="border-b border-neutral-600 p-4"
          />
          {/* Stock Overview Blocks */}
          <div className="w-full overflow-auto border-b border-neutral-600 p-2 text-sm">
            {/* Horizontal Blocks */}
            <div className="flex flex-row py-2">
              {/* Vertical Text List */}
              <div className="flex min-w-fit flex-col gap-2 border-r border-neutral-600 pr-4 text-neutral-500">
                {/* Label and Data */}
                <div className="flex flex-row justify-between gap-12">
                  <div>Open</div>
                  <div className="text-neutral-100">
                    {Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(
                      Number(
                        Object.values(stockData!["Time Series (Daily)"])[0]![
                          "1. open"
                        ]
                      )
                    )}
                  </div>
                </div>
                <div className="flex flex-row justify-between gap-12">
                  <div>High</div>
                  <div className="text-neutral-100">
                    {Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(
                      Number(
                        Object.values(stockData!["Time Series (Daily)"])[0]![
                          "2. high"
                        ]
                      )
                    )}
                  </div>
                </div>
                <div className="flex flex-row justify-between gap-12">
                  <div>Low</div>
                  <div className="text-neutral-100">
                    {Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(
                      Number(
                        Object.values(stockData!["Time Series (Daily)"])[0]![
                          "3. low"
                        ]
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="flex min-w-fit flex-col gap-2 border-r border-neutral-600 px-4 text-neutral-500">
                <div className="flex flex-row justify-between gap-12">
                  <div>Mkt Cap</div>
                  <div className="text-neutral-100">
                    {Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(Number(stockOverview?.MarketCapitalization))}
                  </div>
                </div>
                <div className="flex flex-row justify-between gap-12">
                  <div>P{"/"}E</div>
                  <div className="text-neutral-100">
                    {Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(Number(stockOverview?.TrailingPE))}
                  </div>
                </div>
                <div className="flex flex-row justify-between gap-12">
                  <div>EBITDA</div>
                  <div className="text-neutral-100">
                    {Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(Number(stockOverview?.EBITDA))}
                  </div>
                </div>
              </div>
              <div className="flex min-w-fit flex-col gap-2 border-r border-neutral-600 px-4 text-neutral-500">
                <div className="flex flex-row justify-between gap-12">
                  <div>52W H</div>
                  <div className="text-neutral-100">
                    {Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(Number(stockOverview?.["52WeekHigh"]))}
                  </div>
                </div>
                <div className="flex flex-row justify-between gap-12">
                  <div>52W L</div>
                  <div className="text-neutral-100">
                    {Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(Number(stockOverview?.["52WeekLow"]))}
                  </div>
                </div>
                <div className="flex flex-row justify-between gap-12">
                  <div>200MA</div>
                  <div className="text-neutral-100">
                    {Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(Number(stockOverview?.["200DayMovingAverage"]))}
                  </div>
                </div>
              </div>
              <div className="flex min-w-fit flex-col gap-2 px-4 text-neutral-500">
                <div className="flex flex-row justify-between gap-12">
                  <div>Yield</div>
                  <div className="text-neutral-100">
                    {Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(Number(stockOverview?.DividendYield) * 100)}
                    {"%"}
                  </div>
                </div>
                <div className="flex flex-row justify-between gap-12">
                  <div>Beta</div>
                  <div className="text-neutral-100">
                    {Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(Number(stockOverview?.Beta))}
                  </div>
                </div>
                <div className="flex flex-row justify-between gap-12">
                  <div>EPS</div>
                  <div className="text-neutral-100">
                    {Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(Number(stockOverview?.EPS))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* News Section */}
          <div className="flex w-full flex-col gap-4 p-2 py-4">
            <div className="py-2 text-3xl font-extrabold">News</div>
            {newsData!.feed ? (
              newsData!.feed.map((feed, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between gap-8">
                    <a className="font-bold" href={`${feed.url}`}>
                      {feed.title}
                    </a>{" "}
                    <div className="min-w-fit text-right font-medium text-neutral-300">{`${feed.source}`}</div>
                  </div>
                  <div className="text-neutral-500">{feed.summary}</div>
                </div>
              ))
            ) : (
              <div>No news available.</div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Stock;
