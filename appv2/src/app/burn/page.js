"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { hexToString, stringToHex, ALPH_TOKEN_ID } from "@alephium/web3";
import { useLanguage } from "../context/LanguageContext";
import { FaFire } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { web3 } from "@alephium/web3";
import {
  getContractFactory,
  getAlphFurnaceFactory,
  getTokenList,
  ALPH_TOKEN_METADATA,
  getNodeUrl,
} from "../services/utils";
import Image from "next/image";

// ALPHFurnace.BurnedALPH events do not carry a tokenBurned field (ALPH is
// implicit). We normalise to the same shape TokenFurnace.Burned emits by
// encoding ALPH_TOKEN_ID through stringToHex, so that downstream code that
// does `hexToString(burn.tokenId)` resolves to ALPH_TOKEN_ID and therefore
// matches ALPH_TOKEN_METADATA in the tokenList.
const ALPH_ENCODED_TOKEN_ID = stringToHex(ALPH_TOKEN_ID);

const formatAmount = (amount, decimals) => {
  const amountBigInt = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const num = Number(amountBigInt) / Number(divisor);

  if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toLocaleString();
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString(navigator.language, {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const formatAddress = (address) => {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

const formatTokenId = (tokenId) => {
  return `${tokenId.substring(0, 6)}...${tokenId.substring(
    tokenId.length - 4
  )}`;
};

function BurnHistoryCard({ burn, theme, tokenList }) {
  const { t } = useLanguage();
  const tokenMetadata = tokenList.find(
    (token) => token.id === hexToString(burn.tokenId)
  );

  console.log("BurnHistoryCard data:", {
    burn,
    tokenMetadata,
    amount: burn.amount,
    decimals: burn.decimals,
    formattedAmount: formatAmount(burn.amount, burn.decimals),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      } rounded-xl p-4 border`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-400/10 rounded-lg flex items-center justify-center">
            {tokenMetadata?.logoURI ? (
              <Image
                src={tokenMetadata.logoURI}
                alt="token logo"
                width={40}
                height={40}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <FaFire className="text-red-400 w-6 h-6" />
            )}
          </div>
          <div>
            <p
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {formatAmount(burn.amount, burn.decimals)}{" "}
              {tokenMetadata?.symbol || formatTokenId(burn.tokenId)}
            </p>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              {t("by")} {formatAddress(burn.burner)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            {formatDate(burn.timestamp)}
          </p>
          <a
            href={`https://explorer.alephium.org/transactions/${burn.txId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 text-sm hover:text-orange-500"
          >
            {t("viewTransaction")} →
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function BurnSkeleton({ theme }) {
  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      } rounded-xl p-4 border animate-pulse`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-400/10 rounded-lg w-8 h-8"></div>
          <div>
            <div
              className={`h-4 w-32 rounded ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              } mb-2`}
            ></div>
            <div
              className={`h-3 w-24 rounded ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
            ></div>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`h-3 w-20 rounded ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            } mb-2`}
          ></div>
          <div
            className={`h-3 w-24 rounded ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
}

function TopBurnerSkeleton({ theme }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      } rounded-xl p-4 border animate-pulse`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-400/10 rounded-lg w-8 h-8"></div>
          <div>
            <div
              className={`h-4 w-28 rounded ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              } mb-2`}
            ></div>
            <div
              className={`h-3 w-20 rounded ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
            ></div>
          </div>
        </div>
        <div
          className={`h-4 w-16 rounded ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
          }`}
        ></div>
      </div>
    </motion.div>
  );
}

function BurnHistory() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [burns, setBurns] = useState([]);
  const [tokenList, setTokenList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState(null);
  const [totalBurns, setTotalBurns] = useState(null);
  const [topBurners, setTopBurners] = useState([]);
  const [topTokens, setTopTokens] = useState([]);
  const subscriptionsRef = useRef([]);

  const updateTopBurners = (newBurn) => {
    setTopBurners((prevBurners) => {
      const burnerMap = new Map();

      prevBurners.forEach((burner) => {
        burnerMap.set(burner.address, {
          address: burner.address,
          totalBurns: burner.totalBurns,
          uniqueTokens: new Set(burner.uniqueTokens),
        });
      });

      const existingBurner = burnerMap.get(newBurn.burner) || {
        address: newBurn.burner,
        totalBurns: 0,
        uniqueTokens: new Set(),
      };

      existingBurner.totalBurns += 1;
      existingBurner.uniqueTokens.add(newBurn.tokenId);
      burnerMap.set(newBurn.burner, existingBurner);

      return Array.from(burnerMap.values())
        .sort((a, b) => b.totalBurns - a.totalBurns)
        .slice(0, 5);
    });
  };

  const updateTopTokens = (newBurn) => {
    setTopTokens((prevTokens) => {
      const tokenMap = new Map();

      prevTokens.forEach((token) => {
        tokenMap.set(token.tokenId, { ...token });
      });

      const tokenMetadata = tokenList.find(
        (token) => token.id === hexToString(newBurn.tokenId)
      );

      const existingToken = tokenMap.get(hexToString(newBurn.tokenId)) || {
        tokenId: hexToString(newBurn.tokenId),
        symbol: tokenMetadata?.symbol,
        logoURI: tokenMetadata?.logoURI,
        burnCount: 0,
      };

      existingToken.burnCount += 1;

      if (tokenMetadata?.symbol) {
        existingToken.symbol = tokenMetadata.symbol;
      }

      tokenMap.set(hexToString(newBurn.tokenId), existingToken);

      return Array.from(tokenMap.values())
        .sort((a, b) => b.burnCount - a.burnCount)
        .slice(0, 5);
    });
  };

  useEffect(() => {
    console.log("Setting up node provider...");
    web3.setCurrentNodeProvider(getNodeUrl(), undefined, undefined);
    console.log("Node provider setup complete");
  }, []);

  // Token list fetch with logging
  useEffect(() => {
    const fetchTokenList = async () => {
      console.log("Fetching token list...");
      try {
        const tokens = await getTokenList();
        console.log("Token list fetched:", tokens);
        setTokenList([ALPH_TOKEN_METADATA, ...tokens]);
      } catch (error) {
        console.error("Error fetching token list:", error);
        setTokenList([ALPH_TOKEN_METADATA]);
      }
    };
    fetchTokenList();
  }, []);

  // Event subscription with logging
  useEffect(() => {
    console.log(
      "Setting up event subscriptions, tokenList length:",
      tokenList.length
    );

    // Clean up any existing subscriptions before creating new ones
    subscriptionsRef.current.forEach((subscription) => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
    });
    subscriptionsRef.current = [];

    const ingestBurn = (newBurn) => {
      setBurns((prevBurns) => {
        if (prevBurns.some((burn) => burn.txId === newBurn.txId)) {
          return prevBurns;
        }
        return [newBurn, ...prevBurns];
      });
      updateTopBurners(newBurn);
      updateTopTokens(newBurn);
    };

    // The Alephium node returns 404 on /events/contract/{address} for contracts
    // that have never emitted any event yet (e.g. freshly-deployed furnaces).
    // We must NOT treat that as a fatal error for the whole page: just log
    // and keep the subscription alive so we pick up the first real burn.
    const isNoEventsYet = (error) => {
      const msg = error?.message ?? String(error);
      return /404|not\s*found|no events/i.test(msg);
    };

    async function subscribeEvents() {
      for (let i = 0; i < 4; i++) {
        try {
          console.log(`Subscribing to token-furnace events for group ${i}...`);
          const tokenSubscription = getContractFactory(i).subscribeBurnedEvent({
            pollingInterval: 15000,
            messageCallback: async (event) => {
              console.log(`Received burn event in group ${i}:`, event);
              const meta = tokenList.find(
                (token) => token.id === hexToString(event.fields.tokenBurned)
              );

              ingestBurn({
                txId: event.txId,
                timestamp: Number(event.fields.timestamp),
                tokenId: event.fields.tokenBurned,
                amount: event.fields.amount.toString(),
                burner: event.fields.caller,
                decimals: meta?.decimals ?? 18,
                group: i,
              });
              return Promise.resolve();
            },
            errorCallback: (error) => {
              if (isNoEventsYet(error)) {
                console.log(
                  `TokenFurnace group ${i} has no events yet, will keep polling`
                );
              } else {
                console.error(`Error from contract factory ${i}:`, error);
              }
              return Promise.resolve();
            },
          });
          subscriptionsRef.current.push(tokenSubscription);
        } catch (err) {
          console.warn(
            `Skipping TokenFurnace subscription for group ${i}:`,
            err.message
          );
        }

        try {
          console.log(`Subscribing to alph-furnace events for group ${i}...`);
          const alphSubscription = getAlphFurnaceFactory(
            i
          ).subscribeBurnedALPHEvent({
            pollingInterval: 15000,
            messageCallback: async (event) => {
              console.log(`Received ALPH burn event in group ${i}:`, event);
              ingestBurn({
                txId: event.txId,
                timestamp: Number(event.fields.timestamp),
                tokenId: ALPH_ENCODED_TOKEN_ID,
                amount: event.fields.amount.toString(),
                burner: event.fields.caller,
                decimals: ALPH_TOKEN_METADATA.decimals,
                group: i,
              });
              return Promise.resolve();
            },
            errorCallback: (error) => {
              if (isNoEventsYet(error)) {
                console.log(
                  `ALPHFurnace group ${i} has no events yet, will keep polling`
                );
              } else {
                console.error(`Error from ALPH furnace ${i}:`, error);
              }
              return Promise.resolve();
            },
          });
          subscriptionsRef.current.push(alphSubscription);
        } catch (err) {
          console.warn(
            `Skipping ALPH furnace subscription for group ${i}:`,
            err.message
          );
        }
      }
    }
    subscribeEvents();

    // Cleanup: unsubscribe from all subscriptions when effect re-runs or component unmounts
    return () => {
      console.log("Cleaning up event subscriptions...");
      subscriptionsRef.current.forEach((subscription) => {
        if (subscription && typeof subscription.unsubscribe === "function") {
          subscription.unsubscribe();
        }
      });
      subscriptionsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenList]);

  // Total burns fetch with logging
  useEffect(() => {
    async function fetchTotalBurns() {
      console.log("Fetching total burns...");
      let total = 0;
      let countsAvailable = true;
      for (let i = 0; i < 4; i++) {
        try {
          const count = await getContractFactory(
            i
          ).getContractEventsCurrentCount();
          console.log(`Group ${i} burn count:`, count);
          total += Number(count);
        } catch (error) {
          countsAvailable = false;
          console.error(`Error fetching burns count for group ${i}:`, error);
        }

        try {
          const alphCount = await getAlphFurnaceFactory(
            i
          ).getContractEventsCurrentCount();
          console.log(`Group ${i} ALPH burn count:`, alphCount);
          total += Number(alphCount);
        } catch (error) {
          countsAvailable = false;
          console.warn(
            `No ALPH furnace event count for group ${i}:`,
            error.message
          );
        }
      }
      console.log("Total burns:", total);
      setTotalBurns(countsAvailable ? total : null);
      setIsLoading(false);
    }
    fetchTotalBurns();
  }, []);

  // Log state changes
  useEffect(() => {
    console.log("Current state:", {
      isLoading,
      tokenListLength: tokenList.length,
      burnsLength: burns.length,
      totalBurns,
      error,
    });
  }, [isLoading, tokenList, burns, totalBurns, error]);

  if (isLoading) {
    return (
      <div className="history-page">
        <div className="page-heading">
          <span className="eyebrow">{t("historyEyebrow")}</span>
          <h1>{t("historyTitle")}</h1>
          <p>{t("historyDescription")}</p>
        </div>
        <section className="history-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${
                  theme === "dark"
                    ? "bg-gray-800/50 text-white"
                    : "bg-white/50 text-gray-900"
                } backdrop-blur-xl rounded-2xl p-6`}
              >
                <div className="flex justify-between items-center mb-6">
                  <div
                    className={`h-6 w-32 rounded ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-6 w-24 rounded ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <BurnSkeleton key={index} theme={theme} />
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${
                  theme === "dark"
                    ? "bg-gray-800/50 text-white"
                    : "bg-white/50 text-gray-900"
                } backdrop-blur-xl rounded-2xl p-6`}
              >
                <div
                  className={`h-6 w-32 rounded ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  } mb-6`}
                ></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <TopBurnerSkeleton key={index} theme={theme} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error)
    return (
      <div className="history-page">
        <div className="page-heading">
          <span className="eyebrow">{t("historyEyebrow")}</span>
          <h1>{t("historyTitle")}</h1>
          <p>{t("historyDescription")}</p>
        </div>
        Error: {error}
      </div>
    );

  return (
    <div className="history-page">
      <div className="page-heading">
        <span className="eyebrow">{t("historyEyebrow")}</span>
        <h1>{t("historyTitle")}</h1>
        <p>{t("historyDescription")}</p>
      </div>
      <section className="history-content">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${
                theme === "dark"
                  ? "bg-gray-800/50 text-white"
                  : "bg-white/50 text-gray-900"
              } backdrop-blur-xl rounded-2xl p-6`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("burnHistory")}
                </h2>
                <div
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }
                >
                  {t("totalBurns")}: {totalBurns ?? "—"}
                </div>
              </div>
              <div className="space-y-4">
                {burns.length === 0 && (
                  <div className="history-empty">
                    <FaFire className="empty-history-flame" />
                    <h3>
                      {t(
                        totalBurns === null ? "activityUnavailable" : "noBurns"
                      )}
                    </h3>
                    <p>
                      {t(
                        totalBurns === null
                          ? "activityUnavailableText"
                          : "noBurnsText"
                      )}
                    </p>
                  </div>
                )}
                {burns.map((burn, index) => (
                  <BurnHistoryCard
                    key={index}
                    burn={burn}
                    theme={theme}
                    tokenList={tokenList}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${
                theme === "dark"
                  ? "bg-gray-800/50 text-white"
                  : "bg-white/50 text-gray-900"
              } backdrop-blur-xl rounded-2xl p-6 space-y-6`}
            >
              <div>
                <h2
                  className={`text-xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  } mb-6`}
                >
                  {t("topBurners")}
                </h2>
                <div className="space-y-4">
                  {topBurners.length === 0 && (
                    <p className="ranking-empty">{t("noRankings")}</p>
                  )}
                  {topBurners.map((burner, index) => (
                    <motion.div
                      key={burner.address}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      } rounded-xl p-4 border`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-400/10 rounded-lg">
                            <span className="text-red-400 font-bold">
                              #{index + 1}
                            </span>
                          </div>
                          <div>
                            <p
                              className={
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }
                            >
                              {formatAddress(burner.address)}
                            </p>
                            <p
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {burner.uniqueTokens.size} {t("tokens")}
                            </p>
                          </div>
                        </div>
                        <p className="text-orange-400 font-semibold">
                          {burner.totalBurns} {t("burns")}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h2
                  className={`text-xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  } mb-6`}
                >
                  {t("mostBurnedTokens")}
                </h2>
                <div className="space-y-4">
                  {topTokens.length === 0 && (
                    <p className="ranking-empty">{t("noRankings")}</p>
                  )}
                  {topTokens.map((token, index) => {
                    const tokenMetadata = tokenList.find(
                      (t) => t.id === token.tokenId
                    );
                    return (
                      <motion.div
                        key={token.tokenId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        } rounded-xl p-4 border`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-400/10 rounded-lg flex items-center justify-center">
                              {tokenMetadata?.logoURI ? (
                                <Image
                                  src={tokenMetadata.logoURI}
                                  alt="token logo"
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-contain rounded-lg"
                                />
                              ) : (
                                <span className="text-red-400 font-bold">
                                  #{index + 1}
                                </span>
                              )}
                            </div>
                            <div>
                              <p
                                className={
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }
                              >
                                {tokenMetadata?.symbol ||
                                  formatTokenId(token.tokenId)}
                              </p>
                            </div>
                          </div>
                          <p className="text-orange-400 font-semibold">
                            {token.burnCount} {t("burns")}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BurnHistory;
