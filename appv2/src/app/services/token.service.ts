import {
  DUST_AMOUNT,
  ExecuteScriptResult,
  MINIMAL_CONTRACT_DEPOSIT,
  SignerProvider,
} from "@alephium/web3";
import { getContractFactory } from "./utils";


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

  if(!isMax) {

     decimalsPower = BigInt(tokenDecimals-decimalsAmount)
    console.log("test "+amount * 10n ** decimalsPower)
  }


  const contract = getContractFactory(groupIndex)
  return await contract.transact.burn({
    args: {
      amountToBurn: !isMax ? amount * 10n ** decimalsPower : amount,
      tokenIdToBurn: tokenIdToBurn,
      withNft: withNft
    },
    signer: signerProvider,
    tokens: [
      {
        id: tokenIdToBurn,
        amount: !isMax ? amount * 10n ** decimalsPower : amount,
      },
    ],
    attoAlphAmount: withNft ? MINIMAL_CONTRACT_DEPOSIT + 2n * DUST_AMOUNT : 2n * DUST_AMOUNT,
  });
}
