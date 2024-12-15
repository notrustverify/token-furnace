import React from 'react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AlephiumWalletProvider } from '@alephium/web3-react'
import {getNetwork} from '@/services/utils'
import { ThemeToggle } from '@/components/ThemeToggle';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
      <AlephiumWalletProvider theme="web95" network={getNetwork()}>
        <Component {...pageProps} />
      </AlephiumWalletProvider>
      <ThemeToggle />
    </>
  )
}
