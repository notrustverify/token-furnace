import React from 'react'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { AlephiumConnectButton, useWallet } from '@alephium/web3-react'
import { FurnacePage } from '@/components/FurnacePage'

export default function Home() {
  const { connectionStatus } = useWallet()

  return (
    <>
      <Head>
        <title>Token convert</title>
        <meta name="description" content="Burn your alphcoins and get NFTs." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FurnacePage />
    </>
  )
}
