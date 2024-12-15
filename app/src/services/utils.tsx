import { NetworkId } from "@alephium/web3";
import { loadDeployments } from "my-contracts/deployments";

export interface TokenList {
  networkId: number;
  tokens: Token[];
}

export interface Token {
  id: string
  name: string
  symbol: string
  decimals: number
  description: string
  logoURI: string
  nameOnChain?: string
  symbolOnChain?: string
} 


export interface TokenFaucetConfig {
  network: NetworkId;
  groupIndex: number;
  tokenFaucetAddress: string;
  faucetTokenId: string;
}


export const convertToInt = (withdrawAmount: string):[bigint, number] => {
  let amountToWithdrawFloat = ''

  if (withdrawAmount.split('.').length > 0)
    amountToWithdrawFloat = withdrawAmount.split('.')[0] + withdrawAmount.split('.')[1]
  return [
    withdrawAmount.split('.').length > 1 ? BigInt(amountToWithdrawFloat) : BigInt(withdrawAmount),
    withdrawAmount.split('.').length > 1 ? Number(withdrawAmount.split('.')[1].length) : Number(0)
  ]
}

export function getNetwork(): NetworkId {
  const network = (process.env.NEXT_PUBLIC_NETWORK ?? "devnet") as NetworkId;
  return network;
}

export const tokenMetadata = (tokenList: Token[], tokenToFind: string) => {
  return tokenList?.find(
    (token: { id: string }) => token.id === tokenToFind
  )
}

export const getContractFactory = (groupIndex: number) => {
  // List of deployer addresses for different groups
  const deployerAddresses: { [key: number]: string } = {
    0: "1GBvuTs4TosNB9xTCGJL5wABn2xTYCzwa7MnXHphjcj1y",
    1: "1HYFRU5D4QAGr5H9ySbkSHRmBjRriV8JtCxE4YCW4jwVu",
    2: "19LjHzaohNvgq2tNZXxXZsVEHq5NuTuDS7Kth85Qo8zm1",
    3: "19YzSyYrwAH7VwVM5KPuAKmK89Chvk9gXup6753VZGUcB"
  }

  const deployerAddress = deployerAddresses[groupIndex]
  if (!deployerAddress) {
    throw new Error(`No deployer address found for group ${groupIndex}`)
  }

  const deployment = loadDeployments(getNetwork(), deployerAddress)
  if(!deployment) throw new Error(`No deployment found for group ${groupIndex}`)
  return deployment.contracts.TokenFurnace!.contractInstance
}

export async function getTokenList(): Promise<Token[]> {
  const url = `https://raw.githubusercontent.com/alephium/token-list/master/tokens/${getNetwork()}.json`;

  const response = await fetch(url);

  if (!response.ok && getNetwork() !== 'devnet') {
    throw new Error("Network response was not ok");
  }

  let data: TokenList = { networkId: 0, tokens: [] };
  data = await response.json();

  /*if(getNetwork() !== 'devnet'){
  }*/
  return data.tokens;
}