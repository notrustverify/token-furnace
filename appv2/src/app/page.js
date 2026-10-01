"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFire } from "react-icons/fa";
import { useWallet } from "@alephium/web3-react";
import { useLanguage } from "./context/LanguageContext";
import { useTheme } from "./context/ThemeContext";
import {
  convertToInt,
  getTokenList,
  ALPH_TOKEN_METADATA,
  getNodeUrl,
} from "./services/utils";
import { burn } from "./services/token.service";
import { useBalance } from "@alephium/web3-react";
import Image from "next/image";
import {
  web3,
  ALPH_TOKEN_ID,
  DUST_AMOUNT,
  MINIMAL_CONTRACT_DEPOSIT,
} from "@alephium/web3";
import {
  Flame,
  ArrowUpRight,
  Wallet,
  ShieldAlert,
  Fingerprint,
} from "lucide-react";
import Link from "next/link";
import { AlephiumConnectButton } from "@alephium/web3-react";
import ConfirmBurnModal from "./components/ConfirmBurnModal";

function BurnInterface() {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const { connectionStatus, account, signer } = useWallet();
  const [selectedToken, setSelectedToken] = useState(null);
  const [burnAmount, setBurnAmount] = useState("");
  const { balance, updateBalanceForTx } = useBalance();
  const [tokenList, setTokenList] = useState([]);
  const [computedBalance, setComputedBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(true);
  const [rawAmount, setRawAmount] = useState();
  const [isCustomToken, setIsCustomToken] = useState(false);
  const [wantNFT, setWantNFT] = useState(false);
  const [burnSummary, setBurnSummary] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [burnError, setBurnError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    web3.setCurrentNodeProvider(getNodeUrl());
  }, [theme]);

  useEffect(() => {
    const fetchTokens = async () => {
      let filteredTokens = [];
      try {
        const tokens = await getTokenList();
        filteredTokens = tokens.filter(
          (token) =>
            balance?.tokenBalances?.some(
              (balanceToken) =>
                balanceToken.id === token.id && balanceToken.amount > 0n
            ) ?? false
        );
      } catch (error) {
        console.error("Error fetching tokens:", error);
      }

      // Always include ALPH at the top so the user can pick it for burning,
      // regardless of whether the remote token-list fetch succeeded. ALPH is
      // the native coin so it is never listed in tokenBalances anyway.
      const list = [
        ALPH_TOKEN_METADATA,
        ...filteredTokens.filter((t) => t.id !== ALPH_TOKEN_ID),
      ];
      setTokenList(list);
      setIsLoading(false);
    };

    fetchTokens();
  }, [balance]);

  useEffect(() => {
    if (!selectedToken) return;

    if (selectedToken.id === ALPH_TOKEN_ID) {
      if (balance?.balance) {
        const balanceWithDecimals =
          Number(balance.balance) / Math.pow(10, selectedToken.decimals);
        setComputedBalance(balanceWithDecimals.toString());
      } else {
        setComputedBalance("0");
      }
      return;
    }

    if (balance?.tokenBalances) {
      const tokenBalance = balance.tokenBalances.find(
        (token) => token.id === selectedToken.id
      );
      if (tokenBalance) {
        const balanceWithDecimals =
          Number(tokenBalance.amount) / Math.pow(10, selectedToken.decimals);
        setComputedBalance(balanceWithDecimals.toString());
      } else {
        setComputedBalance("0");
      }
    }
  }, [balance, selectedToken]);

  const handlePercentageClick = (percentage) => {
    if (selectedToken && computedBalance) {
      if (percentage === 100) {
        if (selectedToken.id === ALPH_TOKEN_ID) {
          // Reserve some ALPH for gas, sub-contract deposit (if NFT), and dust.
          const gasReserve = 2n * 10n ** 17n; // ~0.2 ALPH safety buffer for gas
          const overhead =
            (wantNFT ? MINIMAL_CONTRACT_DEPOSIT : 0n) +
            2n * DUST_AMOUNT +
            gasReserve;
          const raw = BigInt(balance.balance);
          const spendable = raw > overhead ? raw - overhead : 0n;

          const formattedAmount = (
            Number(spendable) / Math.pow(10, selectedToken.decimals)
          ).toLocaleString("fullwide", {
            useGrouping: false,
            maximumFractionDigits: selectedToken.decimals,
          });

          setBurnAmount(formattedAmount);
          setRawAmount(spendable);
          return;
        }

        const tokenBalance = balance.tokenBalances.find(
          (token) => token.id === selectedToken.id
        );
        if (tokenBalance) {
          const balanceWithDecimals =
            Number(tokenBalance.amount) / Math.pow(10, selectedToken.decimals);

          const formattedAmount = balanceWithDecimals.toLocaleString(
            "fullwide",
            {
              useGrouping: false,
              maximumFractionDigits: selectedToken.decimals,
            }
          );

          setBurnAmount(formattedAmount);
          setRawAmount(tokenBalance.amount);
        }
      } else {
        const amount = (
          Number(computedBalance) *
          (percentage / 100)
        ).toString();
        setBurnAmount(amount);
        setRawAmount(undefined);
      }
    }
  };

  const handleBurn = async () => {
    if (!burnAmount) {
      alert(t("enterAmount"));
      return;
    }

    if (burnAmount === computedBalance) {
      setShowConfirmModal(true);
    } else {
      await handleConfirmBurn();
    }
  };

  const handleConfirmBurn = async () => {
    if (signer && !isSubmitting) {
      setIsSubmitting(true);
      setBurnError("");
      try {
        const cleanAmount = burnAmount.toString().replace(",", ".");
        const floatToDecimals = rawAmount
          ? [rawAmount, 0]
          : convertToInt(cleanAmount);

        const tx = await burn(
          signer,
          BigInt(floatToDecimals[0]),
          Number(floatToDecimals[1]),
          selectedToken?.id ?? "",
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
          txId: tx.txId,
        });
      } catch (error) {
        console.error("Error during burn:", error);
        setBurnError(t("burnFailed"));
      } finally {
        setIsSubmitting(false);
      }
    }
    setShowConfirmModal(false);
  };

  const formatAmount = (amount) => {
    return Number(amount).toFixed(2);
  };

  return (
    <div className="burn-page">
      <header className="burn-intro">
        <div>
          <h1>{t("burnPageTitle")}</h1>
          <p>{t("burnPageDescription")}</p>
        </div>
        <Link href="/burn" className="text-link">
          {t("burnHistory")}
          <ArrowUpRight size={17} />
        </Link>
      </header>
      <div className="burn-workspace">
        <section className="burn-form-column">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`burn-panel backdrop-blur-xl rounded-2xl p-6 border transition-colors duration-200 ${
              isDark
                ? "bg-gray-800/50 text-white border-gray-700/50"
                : "bg-white/50 text-gray-900 border-gray-200/50"
            }`}
          >
            <div className="panel-heading">
              <span className="small-flame">
                <Flame size={21} />
              </span>
              <div>
                <h2>{t("burnPanelTitle")}</h2>
                <p>{t("burnPanelDescription")}</p>
              </div>
            </div>

            {connectionStatus !== "connected" ? (
              <div className="wallet-empty">
                <div className="empty-icon">
                  <Wallet size={29} strokeWidth={1.5} />
                </div>
                <h3>{t("walletTitle")}</h3>
                <p>{t("furnaceWalletDescription")}</p>
                <div className="wallet-empty-connect">
                  <AlephiumConnectButton />
                </div>
                <div className="wallet-preview">
                  <span>{t("selectTokenToBurn")}</span>
                  <span>—</span>
                </div>
                <div className="wallet-preview">
                  <span>{t("amount")}</span>
                  <span>0.00</span>
                </div>
              </div>
            ) : (
              <>
                {isLoading ? (
                  <div className="space-y-4">
                    <div
                      className="animate-pulse rounded-lg h-[42px] w-full"
                      style={{ background: "var(--soft)" }}
                    />
                    <div
                      className="animate-pulse rounded-lg h-[42px] w-full"
                      style={{ background: "var(--soft)" }}
                    />
                    <div
                      className="animate-pulse rounded-lg h-[42px] w-full"
                      style={{ background: "var(--soft)" }}
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="field-label" htmlFor="burn-token">
                        {t("selectTokenToBurn")}
                      </label>
                      <select
                        id="burn-token"
                        value={
                          isCustomToken ? "custom" : selectedToken?.symbol || ""
                        }
                        onChange={(e) => {
                          if (e.target.value === "custom") {
                            setIsCustomToken(true);
                            setSelectedToken(null);
                            setBurnAmount("");
                          } else {
                            setIsCustomToken(false);
                            const token = tokenList.find(
                              (t) => t.symbol === e.target.value
                            );
                            setSelectedToken(token);
                            setBurnAmount("");
                          }
                        }}
                        className={`w-full p-3 rounded-lg appearance-none transition-colors duration-200 ${
                          isDark
                            ? "bg-gray-700 text-white border-gray-600"
                            : "bg-gray-50 text-gray-900 border-gray-200"
                        } border focus:ring-2 focus:ring-orange-400 focus:border-transparent`}
                      >
                        <option value="">{t("select")}...</option>
                        <option value="custom">{t("customToken")}</option>
                        {tokenList.map((token) => (
                          <option key={token.symbol} value={token.symbol}>
                            {token.symbol}
                          </option>
                        ))}
                      </select>
                    </div>

                    {isCustomToken && (
                      <div
                        className={`space-y-2 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <label className="field-label" htmlFor="custom-token">
                          {t("tokenId")}
                        </label>
                        <input
                          type="text"
                          id="custom-token"
                          placeholder={t("tokenId")}
                          onChange={(e) => {
                            setSelectedToken({
                              id: e.target.value,
                              symbol: "Custom Token",
                              decimals: 0,
                              name: "Custom Token",
                              description: "Custom Token",
                              logoURI: "",
                            });
                          }}
                          className={`w-full p-3 rounded-lg transition-colors duration-200 ${
                            isDark
                              ? "bg-gray-700 text-white border-gray-600"
                              : "bg-gray-50 text-gray-900 border-gray-200"
                          } border focus:ring-2 focus:ring-orange-400 focus:border-transparent`}
                        />
                      </div>
                    )}

                    {selectedToken && (
                      <div className="text-center mb-4">
                        <p
                          className={`transition-colors duration-200 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {t("availableBalance")}: {computedBalance}{" "}
                          {selectedToken.symbol}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="relative">
                        <label className="field-label" htmlFor="burn-amount">
                          {t("amount")}
                        </label>
                        <input
                          id="burn-amount"
                          min="0"
                          step="any"
                          type="number"
                          value={burnAmount}
                          onChange={(e) => {
                            setBurnAmount(e.target.value);
                            setRawAmount(undefined);
                          }}
                          placeholder="0.00"
                          className={`w-full p-3 rounded-lg transition-colors duration-200 ${
                            isDark
                              ? "bg-gray-700 text-white border-gray-600"
                              : "bg-gray-50 text-gray-900 border-gray-200"
                          } border focus:ring-2 focus:ring-orange-400 focus:border-transparent text-center`}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        {[10, 50, 100].map((percentage) => (
                          <button
                            key={percentage}
                            onClick={() => handlePercentageClick(percentage)}
                            className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${
                              isDark
                                ? "bg-gray-600 hover:bg-gray-500 text-gray-300"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                            }`}
                          >
                            {percentage === 100 ? "Max" : `${percentage}%`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="nft-option flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="wantNFT"
                        checked={wantNFT}
                        onChange={(e) => setWantNFT(e.target.checked)}
                        className={`w-4 h-4 rounded transition-colors duration-200 ${
                          isDark
                            ? "bg-gray-700 border-gray-600"
                            : "bg-gray-50 border-gray-200"
                        } border focus:ring-2 focus:ring-orange-400`}
                      />
                      <label
                        htmlFor="wantNFT"
                        className={`text-sm transition-colors duration-200 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {t("receiveNFT")}
                        <small className="nft-note">{t("nftNote")}</small>
                      </label>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBurn}
                      disabled={
                        !selectedToken ||
                        !burnAmount ||
                        Number(burnAmount) <= 0 ||
                        isSubmitting
                      }
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                        !selectedToken || !burnAmount
                          ? isDark
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : isDark
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "bg-orange-400 hover:bg-orange-500 text-white"
                      }`}
                    >
                      {isSubmitting ? t("pendingBurn") : t("burnButton")}
                    </motion.button>
                  </div>
                )}
              </>
            )}
            <div className="permanent-note">
              <ShieldAlert size={15} />
              <span>{t("irreversible")}</span>
            </div>
            {burnError && (
              <p className="form-error" role="alert">
                {burnError}
              </p>
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
                    ? "bg-gray-800/50 text-white border-gray-700/50"
                    : "bg-white/50 text-gray-900 border-gray-200/50"
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
                    <h3 className="font-semibold text-lg mb-1">
                      {t("transactionSubmitted")}
                    </h3>
                    <p className="text-sm opacity-90">
                      {t("burnSummary")}: {formatAmount(burnSummary.amount)}{" "}
                      {burnSummary.symbol}
                    </p>
                    <a
                      href={`https://explorer.alephium.org/transactions/${burnSummary.txId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 text-sm mt-2 inline-block"
                    >
                      {t("viewTransaction")} ↗
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
        <aside className="process-panel">
          <span className="eyebrow">{t("howItWorks")}</span>
          {[
            ["stepOne", "stepOneText", Wallet],
            ["stepTwo", "stepTwoText", Flame],
            ["stepThree", "stepThreeText", Fingerprint],
          ].map(([title, description, Icon], i) => (
            <div className="process-step" key={title}>
              <span className="step-number">0{i + 1}</span>
              <div>
                <Icon size={20} />
                <h3>{t(title)}</h3>
                <p>{t(description)}</p>
              </div>
            </div>
          ))}
          <a
            className="text-link"
            href="https://alephium.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("builtOn")}
            <ArrowUpRight size={16} />
          </a>
        </aside>
      </div>
      <ConfirmBurnModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmBurn}
        amount={burnAmount}
        symbol={selectedToken?.symbol}
        isMax={burnAmount === computedBalance}
      />
    </div>
  );
}

export default BurnInterface;
