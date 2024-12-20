"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@alephium/web3';
import { useLanguage } from '../context/LanguageContext';
import { FaFire } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { web3 } from '@alephium/web3';
import { getContractFactory, getTokenList } from '../services/utils';
import Image from 'next/image';

const formatAmount = (amount, decimals) => {
  const num = Number(amount) / Math.pow(10, decimals);
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toLocaleString();
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString(navigator.language, {
    dateStyle: 'short',
    timeStyle: 'short'
  });
};

const formatAddress = (address) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const formatTokenId = (tokenId) => {
  return `${tokenId.substring(0, 6)}...${tokenId.substring(tokenId.length - 4)}`;
};

function BurnHistoryCard({ burn, theme, tokenList }) {
  const { t } = useLanguage();
  const tokenMetadata = tokenList.find(token => token.id === burn.tokenId);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
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
            <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {formatAmount(burn.amount, burn.decimals)} {tokenMetadata?.symbol || formatTokenId(burn.tokenId)}
            </p>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              {t('by')} {formatAddress(burn.burner)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {formatDate(burn.timestamp)}
          </p>
          <a 
            href={`https://explorer.alephium.org/transactions/${burn.txId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 text-sm hover:text-orange-500"
          >
            {t('viewTransaction')} →
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function BurnSkeleton({ theme }) {
  return (
    <div className={`${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } rounded-xl p-4 border animate-pulse`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-400/10 rounded-lg w-8 h-8"></div>
          <div>
            <div className={`h-4 w-32 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} mb-2`}></div>
            <div className={`h-3 w-24 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
        </div>
        <div className="text-right">
          <div className={`h-3 w-20 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} mb-2`}></div>
          <div className={`h-3 w-24 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
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
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } rounded-xl p-4 border animate-pulse`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-400/10 rounded-lg w-8 h-8"></div>
          <div>
            <div className={`h-4 w-28 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} mb-2`}></div>
            <div className={`h-3 w-20 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
        </div>
        <div className={`h-4 w-16 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
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
  const [error, setError] = useState(null);
  const [totalBurns, setTotalBurns] = useState(0);
  const [topBurners, setTopBurners] = useState([]);
  const [topTokens, setTopTokens] = useState([]);

  useEffect(() => {
    document.body.classList.add(theme);
    document.body.classList.add("font-urbanist",);
  }, []);

  useEffect(() => {
    console.log('Setting up node provider...');
    web3.setCurrentNodeProvider(
      process.env.NEXT_PUBLIC_NODE_URL ?? "https://node.alphaga.app",
      undefined,
      undefined
    );
    console.log('Node provider setup complete');
  }, []);

  // Token list fetch with logging
  useEffect(() => {
    const fetchTokenList = async () => {
      console.log('Fetching token list...');
      try {
        const tokens = await getTokenList();
        console.log('Token list fetched:', tokens);
        setTokenList(tokens);
      } catch (error) {
        console.error('Error fetching token list:', error);
      }
    };
    fetchTokenList();
  }, []);

  // Event subscription with logging
  useEffect(() => {
    console.log('Setting up event subscriptions, tokenList length:', tokenList.length);
    
    async function subscribeEvents() {
      for (let i = 0; i < 4; i++) {
        console.log(`Subscribing to events for group ${i}...`);
        getContractFactory(i).subscribeBurnedEvent({
          pollingInterval: 15000,
          messageCallback: async (event) => {
            console.log(`Received burn event in group ${i}:`, event);
            const tokenMetadata = tokenList.find(token => token.id === event.fields.tokenBurned);
            
            const newBurn = {
              txId: event.txId,
              timestamp: new Date(Number(event.fields.timestamp)).getTime(),
              tokenId: event.fields.tokenBurned,
              amount: event.fields.amount.toString(),
              burner: event.fields.caller,
              tokenSymbol: tokenMetadata?.symbol,
              decimals: tokenMetadata?.decimals ?? 0,
              group: i
            };

            console.log('Processing new burn:', newBurn);
            setBurns(prevBurns => [newBurn, ...prevBurns]);
            updateTopBurners(newBurn);
            updateTopTokens(newBurn);
            return Promise.resolve();
          },
          errorCallback: (error, subscription) => {
            console.error(`Error from contract factory ${i}:`, error);
            setError(error.message);
            subscription.unsubscribe();
            return Promise.resolve();
          },
        });
      }
    }
    subscribeEvents();
  }, [tokenList]);

  // Total burns fetch with logging
  useEffect(() => {
    async function fetchTotalBurns() {
      console.log('Fetching total burns...');
      let total = 0;
      for (let i = 0; i < 4; i++) {
        try {
          const count = await getContractFactory(i).getContractEventsCurrentCount();
          console.log(`Group ${i} burn count:`, count);
          total += Number(count);
        } catch (error) {
          console.error(`Error fetching burns count for group ${i}:`, error);
        }
      }
      console.log('Total burns:', total);
      setTotalBurns(total);
      setIsLoading(false); // Important: Set loading to false after fetching total burns
    }
    fetchTotalBurns();
  }, []);

  // Log state changes
  useEffect(() => {
    console.log('Current state:', {
      isLoading,
      tokenListLength: tokenList.length,
      burnsLength: burns.length,
      totalBurns,
      error
    });
  }, [isLoading, tokenList, burns, totalBurns, error]);

  const updateTopBurners = (newBurn) => {
    setTopBurners(prevBurners => {
      const burnerMap = new Map();
      
      prevBurners.forEach(burner => {
        burnerMap.set(burner.address, {
          address: burner.address,
          totalBurns: burner.totalBurns,
          uniqueTokens: burner.uniqueTokens
        });
      });
      
      const existingBurner = burnerMap.get(newBurn.burner) || {
        address: newBurn.burner,
        totalBurns: 0,
        uniqueTokens: new Set()
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
    setTopTokens(prevTokens => {
      const tokenMap = new Map();
      
      prevTokens.forEach(token => {
        tokenMap.set(token.tokenId, token);
      });
      
      const tokenMetadata = tokenList.find(token => token.id === newBurn.tokenId);
      
      const existingToken = tokenMap.get(newBurn.tokenId) || {
        tokenId: newBurn.tokenId,
        symbol: tokenMetadata?.symbol,
        logoURI: tokenMetadata?.logoURI,
        burnCount: 0
      };
      
      existingToken.burnCount += 1;
      
      if (tokenMetadata?.symbol) {
        existingToken.symbol = tokenMetadata.symbol;
      }
      
      tokenMap.set(newBurn.tokenId, existingToken);
      
      return Array.from(tokenMap.values())
        .sort((a, b) => b.burnCount - a.burnCount)
        .slice(0, 5);
    });
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col relative`}>
        <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 text-white' 
                    : 'bg-white/50 text-gray-900'
                } backdrop-blur-xl rounded-2xl p-6`}
              >
                <div className="flex justify-between items-center mb-6">
                  <div className={`h-6 w-32 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-6 w-24 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
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
                  theme === 'dark' 
                    ? 'bg-gray-800/50 text-white' 
                    : 'bg-white/50 text-gray-900'
                } backdrop-blur-xl rounded-2xl p-6`}
              >
                <div className={`h-6 w-32 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} mb-6`}></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <TopBurnerSkeleton key={index} theme={theme} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div className={`min-h-screen flex flex-col relative`}>
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${
                theme === 'dark' 
                  ? 'bg-gray-800/50 text-white' 
                  : 'bg-white/50 text-gray-900'
              } backdrop-blur-xl rounded-2xl p-6`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {t('burnHistory')}
                </h2>
                <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {t('totalBurns')}: {totalBurns}
                </div>
              </div>
              <div className="space-y-4">
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
                theme === 'dark' 
                  ? 'bg-gray-800/50 text-white' 
                  : 'bg-white/50 text-gray-900'
              } backdrop-blur-xl rounded-2xl p-6 space-y-6`}
            >
              <div>
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}>
                  {t('topBurners')}
                </h2>
                <div className="space-y-4">
                  {topBurners.map((burner, index) => (
                    <motion.div
                      key={burner.address}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${
                        theme === 'dark' 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      } rounded-xl p-4 border`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-400/10 rounded-lg">
                            <span className="text-red-400 font-bold">#{index + 1}</span>
                          </div>
                          <div>
                            <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                              {formatAddress(burner.address)}
                            </p>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {burner.uniqueTokens.size} {t('tokens')}
                            </p>
                          </div>
                        </div>
                        <p className="text-orange-400 font-semibold">
                          {burner.totalBurns} {t('burns')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}>
                  {t('mostBurnedTokens')}
                </h2>
                <div className="space-y-4">
                  {topTokens.map((token, index) => {
                    const tokenMetadata = tokenList.find(t => t.id === token.tokenId);
                    return (
                      <motion.div
                        key={token.tokenId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${
                          theme === 'dark' 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-200'
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
                                <span className="text-red-400 font-bold">#{index + 1}</span>
                              )}
                            </div>
                            <div>
                              <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                                {tokenMetadata?.symbol || formatTokenId(token.tokenId)}
                              </p>
                            </div>
                          </div>
                          <p className="text-orange-400 font-semibold">
                            {token.burnCount} {t('burns')}
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
      </main>
    </div>
  );
}

export default BurnHistory;
