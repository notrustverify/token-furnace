import React from 'react';
import Image from 'next/image';
import styles from "../styles/BurnSummary.module.css";

const humanizeNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toFixed(2);
};

interface BurnSummaryProps {
  amount: string;
  tokenSymbol?: string;
  txId?: string;
  logoURI?: string;
}

export const BurnSummary: React.FC<BurnSummaryProps> = ({ amount, tokenSymbol, txId, logoURI }) => {
  if (!txId) return null;

  const humanizedAmount = humanizeNumber(Number(amount));

  return (
    <div className={styles.summaryContainer}>
      <h3>Burn Summary</h3>
      <div className={styles.tokenInfo}>
       <p>{logoURI && (
          <Image 
            src={logoURI} 
            alt={`${tokenSymbol} logo`} 
            width={24} 
            height={24} 
            className={styles.tokenLogo}
          />
        )}
       {' '} You burned {humanizedAmount} {tokenSymbol}</p>
      </div>
      <a 
        href={`https://explorer.alephium.org/transactions/${txId}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.txLink}
      >
        <Image src="/favicon.ico" alt="Explorer Icon" width={20} height={20} />
        <span>View transaction on explorer</span>
      </a>
    </div>
  );
};