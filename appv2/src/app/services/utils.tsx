import { ALPH_TOKEN_ID, NetworkId } from "@alephium/web3";
import { loadDeployments } from "../../../artifacts/ts/deployments";

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


export const convertToInt = (withdrawAmount: string): [bigint, number] => {
  const normalizedNumber = withdrawAmount.toString()
    .replace(',', '.')
    .trim();

  const [integerPart, decimalPart = ''] = normalizedNumber.split('.')

  const fullNumber = integerPart + decimalPart

  return [
    BigInt(fullNumber),
    decimalPart.length
  ]
}

export function getNetwork(): NetworkId {
  const network = (process.env.NEXT_PUBLIC_NETWORK ?? "mainnet") as NetworkId;
  return network;
}

// A trailing slash in NEXT_PUBLIC_NODE_URL would make the SDK build URLs like
// `{base}//events/contract/...` which the Alephium node answers with a generic
// HTML 404 that doesn't match the SDK's "Contract events of ... not found"
// swallow-pattern. Normalise it here so every call site sees a clean URL.
export function getNodeUrl(): string {
  const url = process.env.NEXT_PUBLIC_NODE_URL ?? "https://node.alphaga.app";
  return url.replace(/\/+$/, "");
}

export const tokenMetadata = (tokenList: Token[], tokenToFind: string) => {
  return tokenList?.find(
    (token: { id: string }) => token.id === tokenToFind
  )
}

// ALPH is never listed in the alephium/token-list repo because it is the
// native coin, so we inject a synthetic metadata entry whenever ALPH needs
// to be rendered as a first-class token (selectors, burn history, etc.).
export const ALPH_TOKEN_METADATA: Token = {
  id: ALPH_TOKEN_ID,
  name: "Alephium",
  symbol: "ALPH",
  decimals: 18,
  description: "Native Alephium token",
  logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/ALPH.png"
}

const deployerAddresses: { [key: number]: string } = {
  0: "1GBvuTs4TosNB9xTCGJL5wABn2xTYCzwa7MnXHphjcj1y",
  1: "1HYFRU5D4QAGr5H9ySbkSHRmBjRriV8JtCxE4YCW4jwVu",
  2: "19LjHzaohNvgq2tNZXxXZsVEHq5NuTuDS7Kth85Qo8zm1",
  3: "19YzSyYrwAH7VwVM5KPuAKmK89Chvk9gXup6753VZGUcB"
}

const getDeployment = (groupIndex: number) => {
  const deployerAddress = deployerAddresses[groupIndex]
  if (!deployerAddress) {
    throw new Error(`No deployer address found for group ${groupIndex}`)
  }

  const deployment = loadDeployments(getNetwork(), deployerAddress)
  if (!deployment) throw new Error(`No deployment found for group ${groupIndex}`)
  return deployment
}

export const getContractFactory = (groupIndex: number) => {
  return getDeployment(groupIndex).contracts.TokenFurnace.contractInstance
}

export const getAlphFurnaceFactory = (groupIndex: number) => {
  const alphFurnace = getDeployment(groupIndex).contracts.ALPHFurnace
  if (!alphFurnace) {
    throw new Error(`ALPHFurnace is not deployed on group ${groupIndex}`)
  }
  return alphFurnace.contractInstance
}

export async function getTokenList(): Promise<Token[]> {
  const url = `https://raw.githubusercontent.com/alephium/token-list/master/tokens/${getNetwork()}.json`;

  const response = await fetch(url);

  if (!response.ok && getNetwork() !== 'mainnet') {
    throw new Error("Network response was not ok");
  }

  let data: TokenList = { networkId: 0, tokens: [] };
  data = await response.json();

  /*if(getNetwork() !== 'devnet'){
  }*/
  return data.tokens;
}