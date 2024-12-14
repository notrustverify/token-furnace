import React, { FC, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { contractFactory, convertToInt, getTokenList, Token, tokenMetadata } from "@/services/utils";
import { burnAndConvert, deposit } from "@/services/token.service";
import { BurnConvertTypes } from "my-contracts";
import { AlephiumConnectButton, useBalance, useWallet } from "@alephium/web3-react";
import { ONE_ALPH, web3 } from "@alephium/web3";

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

export const DepositPage: FC = () => {
  const [amount, setAmount] = useState<string>('');
  const { balance, updateBalanceForTx } = useBalance();
  const [tokenBalanceBurn, setTokenBalanceBurn] = useState<TokenBalance | undefined>();
  const [tokenBalanceConvert, setTokenBalanceConvert] = useState<TokenBalance | undefined>();
  const [tokenBalanceBurnMetadata, setTokenBalanceBurnMetadata] = useState<Token | undefined>(undefined);
  const [tokenBalanceConvertMetadata, setTokenBalanceConvertMetadata] = useState<Token | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [contractState, setContractState] = useState<BurnConvertTypes.State>();
  const { signer, account, connectionStatus } = useWallet();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Replace this with your actual data fetching logic
        setContractState(await contractFactory.fetchState());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (
      connectionStatus === "connected" &&
      contractState !== undefined &&
      balance !== undefined
    ) {
      const tokenBurn = balance.tokenBalances?.find(
        (token: { id: string }) => token.id === contractState.fields.tokenIdBurn)
      const tokenConvert = balance.tokenBalances?.find(
        (token: { id: string }) => token.id === contractState.fields.tokenIdConvert)

      setTokenBalanceBurn(tokenBurn)
      setTokenBalanceConvert(tokenConvert)
      if (tokenBurn == undefined) setTokenBalanceBurn(undefined)
      if (tokenConvert == undefined) setTokenBalanceConvert(undefined)

    }
  }, [balance, connectionStatus, contractState]);

  useEffect(() => {
    const getMetadata = async () => {
      if (contractState !== undefined) {
        const tokenList = await getTokenList()

        setTokenBalanceBurnMetadata(tokenMetadata(tokenList, contractState.fields.tokenIdBurn))
        setTokenBalanceConvertMetadata(tokenMetadata(tokenList, contractState.fields.tokenIdConvert))
        console.log(tokenMetadata(tokenList, contractState.fields.tokenIdConvert))
      }
    }
    getMetadata()
  }, [contractState])

  const handleConvert = async() => {
    if (!amount) {
      alert("Please enter an amount");
      return;
    }

    if (signer && contractState){

      const floatToDecimals = convertToInt(amount)
      console.log(floatToDecimals)
      const tx = await deposit(
        signer,
        floatToDecimals[0],
        floatToDecimals[1],
        contractState.fields.tokenIdConvert,
        tokenBalanceConvertMetadata !== undefined ? tokenBalanceConvertMetadata.decimals : Number(3)
      );
      updateBalanceForTx(tx.txId,1)
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
          <h1>Token converter</h1>
          <h2>Deposit</h2>
          <div style={{ textAlign: 'center' }}>
            {tokenBalanceBurnMetadata?.symbol !== undefined 
              ? tokenBalanceBurnMetadata?.symbol 
              : `${contractState?.fields.tokenIdBurn.slice(0, 4)}...${contractState?.fields.tokenIdBurn.slice(-4)}`} 
             {" "}-{"> "}  
            {tokenBalanceConvertMetadata?.symbol !== undefined 
              ? tokenBalanceConvertMetadata?.symbol 
              : `${contractState?.fields.tokenIdConvert.slice(0, 4)}...${contractState?.fields.tokenIdConvert.slice(-4)}`}
              <p>Pool balance: {Number(contractState?.fields.balanceConvert) / 10 ** (tokenBalanceConvertMetadata?.decimals ?? 0)} {tokenBalanceConvertMetadata?.symbol}</p>
          </div>
          <div>Available Balance: {tokenBalanceBurn !== undefined ? tokenBalanceBurnMetadata !== undefined ? 
            Number(tokenBalanceBurn.amount) / 10 ** tokenBalanceBurnMetadata.decimals : 
            Number(tokenBalanceBurn.amount) : 0}</div>
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
            <button
              onClick={() => setAmount(tokenBalanceBurn ? 
                ((Number(tokenBalanceBurn.amount) / 10 ** (tokenBalanceBurnMetadata?.decimals ?? 0)) * (10 / 100)).toString() 
                : '0')}
              disabled={isLoading || connectionStatus !== 'connected' || Number(contractState?.fields.balanceConvert) <= 0}
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
              onClick={() => setAmount(tokenBalanceBurn ? 
                ((Number(tokenBalanceBurn.amount) / 10 ** (tokenBalanceBurnMetadata?.decimals ?? 0)) * (10 / 100)).toString() 
                : '0')}
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
              onClick={() => setAmount(tokenBalanceBurn ? 
                (Number(tokenBalanceBurn.amount) / 10 ** (tokenBalanceBurnMetadata?.decimals ?? 0)).toString() 
                : '0')}
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
            disabled={isLoading || connectionStatus !== 'connected'}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              cursor: isLoading || connectionStatus !== 'connected' ? "not-allowed" : "pointer",
              backgroundColor: isLoading || connectionStatus !== 'connected' ? "#cccccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Deposit
          </button>
        </>
      )}
    </div>
  );
};
