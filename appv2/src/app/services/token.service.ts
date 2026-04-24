import {
  ALPH_TOKEN_ID,
  DUST_AMOUNT,
  ExecuteScriptResult,
  MINIMAL_CONTRACT_DEPOSIT,
  SignerProvider,
} from "@alephium/web3";
import { getAlphFurnaceFactory, getContractFactory } from "./utils";


export const burn = async (
  signerProvider: SignerProvider,
  amount: bigint,
  decimalsAmount: number,
  tokenIdToBurn: string,
  tokenDecimals: number,
  withNft: boolean,
  groupIndex: number,
  isMax?: boolean
): Promise<ExecuteScriptResult> => {
  let decimalsPower = 0n

  if (!isMax) {
    decimalsPower = BigInt(tokenDecimals - decimalsAmount)
  }

  const resolvedAmount = !isMax ? amount * 10n ** decimalsPower : amount

  if (tokenIdToBurn === ALPH_TOKEN_ID) {
    return burnAlph(signerProvider, resolvedAmount, withNft, groupIndex)
  }

  const contract = getContractFactory(groupIndex)
  return await contract.transact.burn({
    args: {
      amountToBurn: resolvedAmount,
      tokenIdToBurn: tokenIdToBurn,
      withNft: withNft
    },
    signer: signerProvider,
    tokens: [
      {
        id: tokenIdToBurn,
        amount: resolvedAmount,
      },
    ],
    attoAlphAmount: withNft ? MINIMAL_CONTRACT_DEPOSIT + 2n * DUST_AMOUNT : 2n * DUST_AMOUNT,
  });
}

// ALPH cannot be destroyed with burnToken!, so "burning" ALPH locks it forever
// inside the ALPHFurnace contract. The attoAlphAmount the user must approve
// therefore has to cover: the amount being burned, the optional sub-contract
// deposit for the proof NFT, and dust for outputs.
const burnAlph = async (
  signerProvider: SignerProvider,
  amountToBurn: bigint,
  withNft: boolean,
  groupIndex: number
): Promise<ExecuteScriptResult> => {
  const alphFurnace = getAlphFurnaceFactory(groupIndex)

  const overhead = withNft ? MINIMAL_CONTRACT_DEPOSIT + 2n * DUST_AMOUNT : 2n * DUST_AMOUNT

  return await alphFurnace.transact.burn({
    args: {
      amountToBurn,
      withNft,
    },
    signer: signerProvider,
    attoAlphAmount: amountToBurn + overhead,
  })
}
