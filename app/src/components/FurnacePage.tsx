import React, { FC, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { getContractFactory, convertToInt, getTokenList, Token, tokenMetadata } from "@/services/utils";
import { burn } from "@/services/token.service";
import { AlephiumConnectButton, useBalance, useWallet } from "@alephium/web3-react";
import { ONE_ALPH, web3 } from "@alephium/web3";
import { TokenFurnaceTypes } from "my-contracts";
import Select from 'react-select'
import Image from 'next/image'  // Add this import


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
        // Filter tokens that exist in user's balance
        const filteredTokens = data.filter(token =>
          balance?.tokenBalances.some((balanceToken: { id: string; amount: number; }) =>
            balanceToken.id === token.id && balanceToken.amount > 0n
          )
        );

        setTokenList(filteredTokens);
        setTokenSelect(
          filteredTokens.map((token) => ({
            value: token.symbol,
            label: token.symbol
          }))
        );
      });
    };
    getMetadata();
  }, [contractState, balance]);

  useEffect(() => {
    if (balance && selectedToken) {
      const tokenBalance = balance.tokenBalances.find((token: { id: string; }) => token.id === selectedToken.id);
      if (tokenBalance) {
        const balanceWithDecimals = (Number(tokenBalance.amount) / Math.pow(10, selectedToken.decimals));
        setComputedBalance(balanceWithDecimals.toString());
      } else {
        setComputedBalance('0');
      }
    }
  }, [balance, selectedToken]);

  const handleConvert = async () => {
    if (!amount) {
      alert("Please enter an amount");
      return;
    }

    if (signer && contractState) {

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
      updateBalanceForTx(tx.txId, 1)
    }
    console.log("Convert button clicked with amount:", amount);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >



      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <AlephiumConnectButton />
          <h1>Token Furnace</h1>
          <div >
            <div className="w-full max-w-[90vw] px-4 sm:max-w-[80vw]">
              <Image
                src="/burnmeme.webp"
                alt="Burn Meme"
                width={800}
                height={480}
                className="w-full h-auto"
                style={{
                  objectFit: 'contain',
                  maxHeight: '40vh',
                  width: '100%',
                  height: 'auto',
                }}
              />
            </div>
          </div>
          <div>

            <p>Select a token to burn</p>
            <Select
              options={tokenSelect}
              isSearchable={true}
              isClearable={true}
              onChange={(option) => setSelectedToken(tokenList?.find((token) => token.symbol === option?.label))}
              value={tokenSelect?.find(function (option) {
                return option.value === selectedToken?.symbol
              })}
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  width: '173px',  // This matches the default input width
                }),
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '100px',
              marginTop: '10px',
            }}
          >Available Balance: {Number(computedBalance).toFixed(2)} {selectedToken?.symbol}</div>
          <div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                padding: "8px",
                fontSize: "14px",
                marginRight: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div>
              <input
                disabled
                type="checkbox"
                checked={withNft}
                onChange={(e) => setWithNft(e.target.checked)}
                style={{
                  cursor: "not-allowed",  // Change cursor to indicate disabled state
                  opacity: 0.6            // Reduce opacity for disabled appearance
                }}
              />
              <span style={{ 
                color: "#888888",  // Grey color for disabled text
                opacity: 0.6       // Matching opacity with checkbox
              }}>
                Receive NFT (cost 0.1 ALPH)
              </span>
          </div>
          <div>
            <button
              onClick={() => setAmount((Number(computedBalance) * 0.1).toString())}
              disabled={isLoading || connectionStatus !== 'connected'}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                marginRight: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                cursor: isLoading || connectionStatus !== 'connected' ? "not-allowed" : "pointer",
                backgroundColor: isLoading || connectionStatus !== 'connected' ? "#cccccc" : "#007bff",
                color: "white",
              }}
            >
              10%
            </button>
            <button
              onClick={() => setAmount((Number(computedBalance) * 0.5).toString())}
              disabled={isLoading || connectionStatus !== 'connected'}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                marginRight: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                cursor: isLoading || connectionStatus !== 'connected' ? "not-allowed" : "pointer",
                backgroundColor: isLoading || connectionStatus !== 'connected' ? "#cccccc" : "#007bff",
                color: "white",
              }}
            >
              50%
            </button>
            <button
              onClick={() => setAmount(computedBalance)}
              disabled={isLoading || connectionStatus !== 'connected'}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                cursor: isLoading || connectionStatus !== 'connected' ? "not-allowed" : "pointer",
                backgroundColor: isLoading || connectionStatus !== 'connected' ? "#cccccc" : "#007bff",
                color: "white",
              }}
            >
              Max
            </button>
          </div>

          <button
            className={styles.button}
            onClick={handleConvert}
            disabled={isLoading || connectionStatus !== 'connected' || selectedToken?.symbol === 'ALPH'}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              cursor: isLoading || connectionStatus !== 'connected' || selectedToken?.symbol === 'ALPH' ? "not-allowed" : "pointer",
              backgroundColor: isLoading || connectionStatus !== 'connected' || selectedToken?.symbol === 'ALPH' ? "#cccccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {selectedToken?.symbol === 'ALPH' ? 'Cannot burn ALPH' : 'Burn'}
          </button>
        </>
      )}
    </div>
  );
};
