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
  groupIndex: number
): Promise<ExecuteScriptResult> => {
  const decimalsPower = BigInt(tokenDecimals-decimalsAmount)
  console.log(amount * 10n ** decimalsPower)
  console.log(amount * 10n ** decimalsPower)

  const contract = getContractFactory(groupIndex)
  return await contract.transact.burn({
    args: {
      amountToBurn: amount * 10n ** decimalsPower,
      tokenIdToBurn: tokenIdToBurn,
      withNft: withNft
    },
    signer: signerProvider,
    tokens: [
      {
        id: tokenIdToBurn,
        amount: amount * 10n ** decimalsPower,
      },
    ],
    attoAlphAmount: withNft ? MINIMAL_CONTRACT_DEPOSIT + 3n * DUST_AMOUNT : 3n * DUST_AMOUNT,
  });
}
