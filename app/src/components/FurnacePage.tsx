import React, { FC, useCallback, useEffect, useState, useRef } from "react";
import styles from "../styles/FurnacePage.module.css";
import { getContractFactory, convertToInt, getTokenList, Token, tokenMetadata } from "@/services/utils";
import { burn } from "@/services/token.service";
import { AlephiumConnectButton, useBalance, useWallet } from "@alephium/web3-react";
import { node, ONE_ALPH, web3 } from "@alephium/web3";
import { TokenFurnaceTypes } from "my-contracts";
import Select from 'react-select'
import Image from 'next/image'  // Add this import
import { BurnSummary } from "./BurnSummary";
import { CSSTransition, SwitchTransition } from 'react-transition-group';


web3.setCurrentNodeProvider(
  (process.env.NEXT_PUBLIC_NODE_URL as string) ??
  "https://fullnode-testnet.alephium.notrustverify.ch",
  undefined,
  undefined
);

interface TokenBalance {
  id: string;
  amount: bigint;
}

interface OptionSelect {
  value: string
  label: string
}


export const FurnacePage: FC = () => {
  const [amount, setAmount] = useState<string>('');
  const { balance, updateBalanceForTx } = useBalance();
  const [isLoading, setIsLoading] = useState(true);
  const [contractState, setContractState] = useState<TokenFurnaceTypes.State>();
  const { signer, account, connectionStatus } = useWallet();
  const [withNft, setWithNft] = useState<boolean>(false);
  const [tokenSelect, setTokenSelect] = useState<OptionSelect[]>()
  const [tokenList, setTokenList] = useState<Token[]>()
  const [selectedToken, setSelectedToken] = useState<Token | undefined>()
  const [computedBalance, setComputedBalance] = useState<string>('0');
  const [isCustomToken, setIsCustomToken] = useState(false);
  const [txId, setTxId] = useState<string | undefined>(undefined);
  const [showSummary, setShowSummary] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Replace this with your actual data fetching logic
       if(connectionStatus === 'connected') setContractState(await getContractFactory(account?.group).fetchState());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const getMetadata = async () => {
      getTokenList().then((data) => {
        const filteredTokens = data.filter(token =>
          balance?.tokenBalances.some((balanceToken: { id: string; amount: number; }) =>
            balanceToken.id === token.id && balanceToken.amount > 0n
          )
        );

        setTokenList(filteredTokens);
        setTokenSelect([
          { value: 'custom', label: 'Custom Token' },
          ...filteredTokens.map((token) => ({
            value: token.symbol,
            label: token.symbol
          }))
        ]);
      });
    };
    getMetadata();
  }, [contractState, balance]);


  useEffect(() => {
    if (balance && selectedToken) {
      const tokenBalance = balance.tokenBalances.find((token: { id: string; }) => token.id === selectedToken.id);
      if (tokenBalance) {
        const balanceWithDecimals = (Number(tokenBalance.amount) / Math.pow(10, selectedToken.decimals));
        console.log(balanceWithDecimals)
        setComputedBalance(balanceWithDecimals.toString());
      } else {
        setComputedBalance('0');
      }
    }
  }, [balance, selectedToken]);

  useEffect(() => {
    setShowSummary(false);
    setTxId(undefined);
  }, [amount, selectedToken]);

  useEffect(() => {
    if (txId) {
      setShowSummary(true);
    }
  }, [txId]);

  const handleConvert = async () => {
    if (!amount) {
      alert("Please enter an amount");
      return;
    }

    if (amount === computedBalance) {
      if (!window.confirm(`Are you sure you want to burn all your ${selectedToken?.symbol} tokens?`)) {
        return;
      }
    }

    if (signer) {
      try {
        const floatToDecimals = convertToInt(amount)
        console.log(floatToDecimals)
        const tx = await burn(
          signer,
          floatToDecimals[0],
          floatToDecimals[1],
          selectedToken?.id ?? '',
          selectedToken?.decimals ?? 0,
          withNft,
          account?.group
        );
        setTxId(tx.txId)
        updateBalanceForTx(tx.txId, 1)
      } catch (error) {
        console.error("Error during burn:", error);
      }
    }
  };

  const handleMaxClick = () => {
    if (selectedToken && balance) {
      const tokenBalance = balance.tokenBalances.find((token: { id: string; }) => token.id === selectedToken.id);
      if (tokenBalance) {
        // Convert the raw balance to the correct decimal representation
        const balanceWithDecimals = (Number(tokenBalance.amount) / Math.pow(10, selectedToken.decimals));
        setAmount(balanceWithDecimals.toString());
      }
    }
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1 className={styles.title}>Token Furnace</h1>
          <div className={styles.imageContainer}>
            <SwitchTransition>
              <CSSTransition
                key={showSummary ? 'summary' : 'image'}
                timeout={300}
                classNames={{
                  enter: styles.fadeEnter,
                  enterActive: styles.fadeEnterActive,
                  exit: styles.fadeExit,
                  exitActive: styles.fadeExitActive,
                }}
                nodeRef={nodeRef}
              >
                <div ref={nodeRef}>
                  {showSummary ? (
                    <BurnSummary 
                      amount={amount}
                      tokenSymbol={selectedToken?.symbol}
                      txId={txId}
                      logoURI={selectedToken?.logoURI}
                    />
                  ) : (
                    <Image
                      src="/burnmeme.webp"
                      alt="Burn Meme"
                      width={100}
                      height={100}
                      className={styles.burnImage}
                      priority
                    />
                  )}
                </div>
              </CSSTransition>
            </SwitchTransition>
          </div>
          <div>
            <p className={styles.title}>Select a token to burn</p>
            <div className={styles.selectContainer}>
              <Select
                options={tokenSelect}
                isDisabled={isLoading || connectionStatus !== 'connected'}
                isSearchable={true}
                isClearable={true}
                onChange={(option) => {
                  if (option?.value === 'custom') {
                    setIsCustomToken(true);
                    setSelectedToken(undefined);
                  } else {
                    setIsCustomToken(false);
                    setSelectedToken(tokenList?.find((token) => token.symbol === option?.label));
                  }
                }}
                value={tokenSelect?.find(option => option.value === selectedToken?.symbol)}
              />

            </div>
            
            {isCustomToken && (
              <div className={styles.tokenInputContainer}>
                <p className={styles.noTokensText}>
                  Enter custom token ID:
                </p>
                <input
                  type="text"
                  placeholder="Enter token ID"
                  onChange={(e) => {
                    setSelectedToken({
                      id: e.target.value,
                      symbol: 'Custom Token',
                      decimals: 0,
                      name: 'Custom Token',
                      description: 'Custom Token',
                      logoURI: ''
                    })
                  }}
                  className={styles.tokenInput}
                />
              </div>
            )}
          </div>

          <div className={styles.balanceContainer}>
            Available Balance: {Number(computedBalance).toFixed(2)} {selectedToken?.symbol}
          </div>

          <div>
            <input
              disabled={isLoading || connectionStatus !== 'connected'}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.amountInput}
            />
          </div>

          <div>
            <button
              onClick={() => setAmount((Number(computedBalance) * 0.1).toString())}
              disabled={isLoading || connectionStatus !== 'connected'}
              className={styles.percentageButton}
            >
              10%
            </button>
            <button
              onClick={() => setAmount((Number(computedBalance) * 0.5).toString())}
              disabled={isLoading || connectionStatus !== 'connected'}
              className={styles.percentageButton}
            >
              50%
            </button>
            <button
              onClick={handleMaxClick}
              disabled={isLoading || connectionStatus !== 'connected'}
              className={styles.percentageButton}
            >
              Max
            </button>
          </div>
          
          <div className={styles.checkboxContainer} hidden >
            <label className={styles.checkboxLabel}>
              <input
                disabled={isLoading || connectionStatus !== 'connected'}
                type="checkbox"
                checked={withNft}
                onChange={(e) => setWithNft(e.target.checked)}
                className={styles.checkbox}
              />
              Receive NFT (cost 0.1 ALPH)
            </label>
          </div>

          <button
            onClick={handleConvert}
            disabled={isLoading || connectionStatus !== 'connected' || selectedToken?.symbol === 'ALPH'}
            className={styles.burnButton}
          >
            {selectedToken?.symbol === 'ALPH' ? 'Cannot burn ALPH' : 'Burn'}
          </button>
        </>
      )}
    </div>
  );
};
