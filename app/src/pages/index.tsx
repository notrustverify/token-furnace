import React from 'react'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { AlephiumConnectButton, useWallet } from '@alephium/web3-react'
import { FurnacePage } from '@/components/FurnacePage'
import Link from 'next/link'

export default function Home() {
  const { connectionStatus } = useWallet()

  return (
    <div className={styles.container}>
      <Head>
        <title>Token furnace</title>
        <meta name="description" content="Burn your alphcoins and get NFTs." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/burn" className={styles.navLink}>
            Burn History
          </Link>
          <AlephiumConnectButton />
        </nav>
      </header>

      <main className={styles.main}>
        <FurnacePage />
      </main>
    </div>
  )
}
