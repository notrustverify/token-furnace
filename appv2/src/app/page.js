"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFire } from 'react-icons/fa';
import { useWallet } from '@alephium/web3-react';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import { getContractFactory, convertToInt, getTokenList } from "./services/utils";
import { burn } from "./services/token.service";
import { useBalance } from "@alephium/web3-react";
import Image from 'next/image';
import { web3 } from '@alephium/web3';

function BurnInterface() {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const { connectionStatus, account, signer } = useWallet();
  const [selectedToken, setSelectedToken] = useState(null);
  const [burnAmount, setBurnAmount] = useState('');
  const { balance, updateBalanceForTx } = useBalance();
  const [tokenList, setTokenList] = useState([]);
  const [computedBalance, setComputedBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(true);
  const [rawAmount, setRawAmount] = useState();
  const [isCustomToken, setIsCustomToken] = useState(false);
  const [wantNFT, setWantNFT] = useState(false);
  const [burnSummary, setBurnSummary] = useState(null);

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(theme);
    web3.setCurrentNodeProvider(process.env.NEXT_PUBLIC_NODE_URL ?? "https://node.alphaga.app");
  }, [theme]);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const tokens = await getTokenList();
        const filteredTokens = tokens.filter(token =>
          balance?.tokenBalances?.some(balanceToken =>
            balanceToken.id === token.id && balanceToken.amount > 0n
          ) ?? false
        );
        setTokenList(filteredTokens);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tokens:", error);
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, [balance]);

  useEffect(() => {
    if (balance?.tokenBalances && selectedToken) {
      const tokenBalance = balance.tokenBalances.find(token => token.id === selectedToken.id);
      if (tokenBalance) {
        const balanceWithDecimals = Number(tokenBalance.amount) / Math.pow(10, selectedToken.decimals);
        setComputedBalance(balanceWithDecimals.toString());
      } else {
        setComputedBalance('0');
      }
    }
  }, [balance, selectedToken]);

  const handlePercentageClick = (percentage) => {
    if (selectedToken && computedBalance) {
      if (percentage === 100) {
        const tokenBalance = balance.tokenBalances.find(token => token.id === selectedToken.id);
        if (tokenBalance) {
          setRawAmount(tokenBalance.amount);
          setBurnAmount(computedBalance);
        }
      } else {
        const amount = (parseFloat(computedBalance.replace(',', '.')) * percentage / 100)
          .toFixed(0)
          .replace(',', '.');
        setBurnAmount(amount);
        setRawAmount(undefined);
      }
    }
  };

  const handleBurn = async () => {
    if (!selectedToken || !burnAmount) return;
    
    try {
      let amountToConvert;
      if (rawAmount) {
        amountToConvert = rawAmount;
      } else {
        const cleanAmount = burnAmount.toString()
          .replace(/\s/g, '')
          .replace(/\./g, '')
          .replace(',', '.');
        
        const formattedAmount = parseFloat(cleanAmount)
          .toFixed(selectedToken.decimals)
          .toString();
        
        amountToConvert = formattedAmount;
      }

      if (isNaN(Number(amountToConvert))) {
        throw new Error('Invalid number format');
      }

      const floatToDecimals = rawAmount ? [rawAmount, 0] : convertToInt(amountToConvert, selectedToken.decimals);
      
      console.log("Amount to convert:", amountToConvert);
      console.log("Converted values:", floatToDecimals);
      console.log("Token decimals:", selectedToken.decimals);
      
      const tx = await burn(
        signer,
        BigInt(floatToDecimals[0]),
        Number(floatToDecimals[1]),
        selectedToken?.id ?? '',
        selectedToken?.decimals ?? 0,
        wantNFT,
        account?.group,
        rawAmount != undefined ? true : false
      );
      
      setRawAmount(undefined);
      updateBalanceForTx(tx.txId, 1);
      setBurnSummary({
        amount: burnAmount,
        symbol: selectedToken.symbol,
        txId: tx.txId
      });
    } catch (error) {
      console.error("Error during burn:", error);
      alert("Failed to process burn amount. Please check the number format.");
    }
  };

  const Skeleton = () => (
    <div className={`animate-pulse rounded-lg ${
      isDark ? 'bg-gray-700' : 'bg-gray-200'
    } h-[42px] w-full`} />
  );

  const formatAmount = (amount) => {
    return Number(amount).toFixed(2);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`backdrop-blur-xl rounded-2xl p-6 border transition-colors duration-200 ${
            isDark 
              ? 'bg-gray-800/50 text-white border-gray-700/50' 
              : 'bg-white/50 text-gray-900 border-gray-200/50'
          }`}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-orange-400/10 rounded-full">
              <FaFire className="text-orange-400 w-8 h-8" />
            </div>
          </div>

          {connectionStatus !== 'connected' ? (
            <div className="text-center space-y-4">
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('connectWalletMessage') || 'Please connect your wallet to burn tokens'}
              </p>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <select
                      value={isCustomToken ? 'custom' : (selectedToken?.symbol || '')}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setIsCustomToken(true);
                          setSelectedToken(null);
                          setBurnAmount('');
                        } else {
                          setIsCustomToken(false);
                          const token = tokenList.find(t => t.symbol === e.target.value);
                          setSelectedToken(token);
                          setBurnAmount('');
                        }
                      }}
                      className={`w-full p-3 rounded-lg appearance-none transition-colors duration-200 ${
                        isDark
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'bg-gray-50 text-gray-900 border-gray-200'
                      } border focus:ring-2 focus:ring-orange-400 focus:border-transparent`}
                    >
                      <option value="">{t('select')}...</option>
                      <option value="custom">Custom Token</option>
                      {tokenList.map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </option>
                      ))}
                    </select>
                  </div>

                  {isCustomToken && (
                    <div className={`space-y-2 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <p className="text-sm">Enter custom token ID:</p>
                      <input
                        type="text"
                        placeholder="Token ID"
                        onChange={(e) => {
                          setSelectedToken({
                            id: e.target.value,
                            symbol: 'Custom Token',
                            decimals: 0,
                            name: 'Custom Token',
                            description: 'Custom Token',
                            logoURI: ''
                          });
                        }}
                        className={`w-full p-3 rounded-lg transition-colors duration-200 ${
                          isDark
                            ? 'bg-gray-700 text-white border-gray-600'
                            : 'bg-gray-50 text-gray-900 border-gray-200'
                        } border focus:ring-2 focus:ring-orange-400 focus:border-transparent`}
                      />
                    </div>
                  )}

                  {selectedToken && (
                    <div className="text-center mb-4">
                      <p className={`transition-colors duration-200 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {t('availableBalance')}: {computedBalance} {selectedToken.symbol}
                      </p>
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="number"
                      value={burnAmount}
                      onChange={(e) => setBurnAmount(e.target.value)}
                      placeholder="0.00"
                      className={`w-full p-3 rounded-lg transition-colors duration-200 ${
                        isDark
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'bg-gray-50 text-gray-900 border-gray-200'
                      } border focus:ring-2 focus:ring-orange-400 focus:border-transparent text-center`}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                      {[10, 50, 100].map((percentage) => (
                        <button
                          key={percentage}
                          onClick={() => handlePercentageClick(percentage)}
                          className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${
                            isDark
                              ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        >
                          {percentage === 100 ? 'Max' : `${percentage}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="wantNFT"
                      checked={wantNFT}
                      onChange={(e) => setWantNFT(e.target.checked)}
                      className={`w-4 h-4 rounded transition-colors duration-200 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-gray-50 border-gray-200'
                      } border focus:ring-2 focus:ring-orange-400`}
                    />
                    <label
                      htmlFor="wantNFT"
                      className={`text-sm transition-colors duration-200 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {t('receiveNFT') || 'Receive NFT for this burn'}
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBurn}
                    disabled={!selectedToken || !burnAmount}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                      !selectedToken || !burnAmount
                        ? isDark 
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : isDark
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-orange-400 hover:bg-orange-500 text-white'
                    }`}
                  >
                    {t('burn')}
                  </motion.button>
                </div>
              )}
            </>
          )}
        </motion.div>

        <AnimatePresence>
          {burnSummary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`mt-4 backdrop-blur-xl rounded-2xl p-6 border transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-800/50 text-white border-gray-700/50' 
                  : 'bg-white/50 text-gray-900 border-gray-200/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-400/10 rounded-lg flex items-center justify-center">
                  {burnSummary.logoURI ? (
                    <Image
                      src={burnSummary.logoURI}
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
                  <h3 className="font-semibold text-lg mb-1">Burn Summary</h3>
                  <p className="text-sm opacity-90">
                    You burned {formatAmount(burnSummary.amount)} {burnSummary.symbol}
                  </p>
                  <a
                    href={`https://explorer.alephium.org/transactions/${burnSummary.txId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 text-sm mt-2 inline-block"
                  >
                    🔥 View transaction on explorer
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default BurnInterface;
