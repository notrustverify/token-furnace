import React, { useCallback, useRef } from 'react'
import { useTxStatus } from '@alephium/web3-react'
import { node } from "@alephium/web3"

interface TxStatusAlertProps {
  txId: string
  txStatusCallback(status: node.TxStatus, numberOfChecks: number): Promise<unknown>
}

export const TxStatus = ({ txId, txStatusCallback }: TxStatusAlertProps) => {
  const numberOfChecks = useRef(0)
  const callback = useCallback(async (status: node.TxStatus) => {
    numberOfChecks.current += 1
    return txStatusCallback(status, numberOfChecks.current)
  }, [txStatusCallback, numberOfChecks])

  const { txStatus } = useTxStatus(txId, callback)

  return (
    <>
      <h3 style={{ margin: 0 }}>
      </h3>
      
    </>
  )
}
