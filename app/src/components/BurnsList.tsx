import React, { useEffect, useState } from 'react';
import styles from '../styles/BurnsList.module.css';
import Image from 'next/image';
import { hexToString, node, web3 } from '@alephium/web3';
import { getContractFactory, getTokenList, Token } from '@/services/utils';
import { TokenFurnaceInstance, TokenFurnaceTypes } from 'my-contracts';

interface BurnEvent {
  txId: string;
  timestamp: number;
  tokenId: string;
  tokenSymbol?: string;
  amount: string;
  burner: string;
  logoURI?: string;
  decimals: number;
  group: number;
}

interface BurnerStats {
  address: string;
  totalBurns: number;
  uniqueTokens: Set<string>;
}

const formatAmount = (amount: string, decimals: number): string => {
  const num = Number(amount) / Math.pow(10, decimals);
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toLocaleString();
};

const truncateSymbol = (symbol: string): string => {
  return symbol.length > 5 ? symbol.slice(0, 5) + '...' : symbol;
};

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString(navigator.language, {
    dateStyle: 'short',
    timeStyle: 'short'
  });
};

export const BurnsList: React.FC = () => {
  const [burns, setBurns] = useState<BurnEvent[]>([]);
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalBurns, setTotalBurns] = useState<number>(0);
  const [topBurners, setTopBurners] = useState<BurnerStats[]>([]);

  web3.setCurrentNodeProvider(
    (process.env.NEXT_PUBLIC_NODE_URL as string) ??
    "https://fullnode-testnet.alephium.org/",
    undefined,
    undefined
  );


  useEffect(() => {
    const fetchTokenList = async () => {
      try {
        const tokens = await getTokenList();
        setTokenList(tokens);
      } catch (error) {
        console.error('Error fetching token list:', error);
      }
    };
    fetchTokenList();
  }, []);

  useEffect(() => {
    async function subscribeEvents() {
      // Subscribe to events from all four contract factories
      for (let i = 0; i < 4; i++) {
        getContractFactory(i).subscribeBurnedEvent({
          pollingInterval: 15000,
          messageCallback: async (
            event: TokenFurnaceTypes.BurnedEvent
          ): Promise<void> => {
            const tokenMetadata = tokenList.find(token => token.id === event.fields.tokenBurned);
            
            const newBurn: BurnEvent = {
              txId: event.txId,
              timestamp: new Date(Number(event.fields.timestamp)).getTime(),
              tokenId: event.fields.tokenBurned,
              amount: (event.fields.amount).toString(),
              burner: event.fields.caller,
              tokenSymbol: tokenMetadata?.symbol,
              logoURI: tokenMetadata?.logoURI,
              decimals: tokenMetadata?.decimals ?? 0,
              group: i
            };

            setBurns(prevBurns => [newBurn, ...prevBurns]);
            updateTopBurners(newBurn);
            return Promise.resolve();
          },
          errorCallback: (
            error: any,
            subscription: { unsubscribe: () => void }
          ): Promise<void> => {
            console.error(`Error received from contract factory ${i}:`, error);
            setError(error.message);
            subscription.unsubscribe();
            return Promise.resolve();
          },
        });
      }
    }
    subscribeEvents();
  }, [tokenList]);

  // You might still want to fetch historical burns when the component mounts
  useEffect(() => {
    const fetchHistoricalBurns = async () => {
      setIsLoading(true);
      try {
        // Implement fetch logic for historical burns here
        // This could be from your backend or by querying past events
        const historicalBurns: BurnEvent[] = []; // Replace with actual fetch
        setBurns(historicalBurns);
      } catch (error) {
        console.error('Error fetching historical burns:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalBurns();
  }, []);

  useEffect(() => {
    async function fetchTotalBurns() {
      let total = 0;
      for (let i = 0; i < 4; i++) {
        try {
          const count = await getContractFactory(i).getContractEventsCurrentCount();
          total += Number(count);
        } catch (error) {
          console.error(`Error fetching burns count for group ${i}:`, error);
        }
      }
      setTotalBurns(total);
    }
    fetchTotalBurns();
  }, []);

  const updateTopBurners = (newBurn: BurnEvent) => {
    setTopBurners(prevBurners => {
      const burnerMap = new Map<string, BurnerStats>();
      
      // Convert previous burners to map
      prevBurners.forEach(burner => {
        burnerMap.set(burner.address, {
          address: burner.address,
          totalBurns: burner.totalBurns,
          uniqueTokens: burner.uniqueTokens
        });
      });
      
      // Update or add new burner
      const existingBurner = burnerMap.get(newBurn.burner) || {
        address: newBurn.burner,
        totalBurns: 0,
        uniqueTokens: new Set<string>()
      };
      
      existingBurner.totalBurns += 1;
      existingBurner.uniqueTokens.add(newBurn.tokenId);
      burnerMap.set(newBurn.burner, existingBurner);
      
      // Convert map back to array and sort
      return Array.from(burnerMap.values())
        .sort((a, b) => b.totalBurns - a.totalBurns)
        .slice(0, 5); // Keep top 5 burners
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.topBurners}>
        <div className={styles.totalBurns}>
          Total Burns: {totalBurns}
        </div>
        <h3>Top Burners</h3>
        <div className={styles.topBurnersList}>
          {topBurners.map((burner, index) => (
            <div key={burner.address} className={styles.topBurnerItem}>
              <span className={styles.rank}>#{index + 1}</span>
              <span className={styles.address}>
                {burner.address.substring(0, 6)}...
                {burner.address.substring(burner.address.length - 4)}
              </span>
              <span className={styles.stats}>
                {burner.totalBurns} burns ({burner.uniqueTokens.size} tokens)
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.list}>
        {burns.map((burn) => (
          <div key={burn.txId} className={styles.burnItem}>
            <div className={styles.tokenInfo}>
              {burn.logoURI && (
                <Image
                  src={burn.logoURI}
                  alt={`${burn.tokenSymbol} logo`}
                  width={24}
                  height={24}
                  className={styles.tokenLogo}
                />
              )}
              <span>
                {burn.tokenSymbol 
                  ? truncateSymbol(burn.tokenSymbol) 
                  : `${burn.tokenId.substring(0, 6)}...${burn.tokenId.substring(burn.tokenId.length - 4)}`
                }
              </span>
            </div>
            <div className={styles.burnDetails}>
              <span>
                {formatAmount(burn.amount, burn.decimals)} burned
              </span>
              <span>by {burn.burner.substring(0, 6)}...{burn.burner.substring(burn.burner.length - 4)}</span>
              <small>Group {burn.group}</small>
              <span>{formatDate(burn.timestamp)}</span>
            </div>
            <a
              href={`https://explorer.alephium.org/transactions/${burn.txId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.txLink}
            >
              tx link
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}; 