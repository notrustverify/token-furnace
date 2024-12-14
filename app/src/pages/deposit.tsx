import React from 'react'
import Head from 'next/head'
import { DepositPage } from '@/components/Deposit'

export default function Deposit() {
  return (
    <>
      <Head>
        <title>Burn alphcoin</title>
        <meta name="description" content="Burn alphcoin." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DepositPage />
    </>
  )
} 