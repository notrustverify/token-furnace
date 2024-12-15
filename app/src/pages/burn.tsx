import React from 'react';
import { BurnsList } from '@/components/BurnsList';
import Link from 'next/link';
import { AlephiumConnectButton } from '@alephium/web3-react';
import styles from '@/styles/Home.module.css';

const BurnsPage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link 
            href={'/'} 
            className={styles.navLink}
          >
            ← Back to Burn Tokens
          </Link>
          <AlephiumConnectButton />
        </nav>
      </header>

      <main className={styles.main}>
        <h1 className="text-3xl font-bold text-gray-900 text-center w-full mb-6">
          Burn History
        </h1>
        </main>
        <BurnsList />
      
    </div>
  );
};

export default BurnsPage; 