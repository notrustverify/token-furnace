import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { TokenFurnace, BurnerNFT } from '../artifacts/ts'
import { hexToString, stringToHex } from '@alephium/web3'
import { expectAssertionError, mintToken } from '@alephium/web3-test'

// This deploy function will be called by cli deployment tool automatically
// Note that deployment scripts should prefixed with numbers (starting from 0)
const deployFaucet: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  if(network.networkId == 3){
   const tokenToBurn = await mintToken("1GBvuTs4TosNB9xTCGJL5wABn2xTYCzwa7MnXHphjcj1y", 1000n*18n)
   const tokenToGet = await mintToken("1GBvuTs4TosNB9xTCGJL5wABn2xTYCzwa7MnXHphjcj1y", 1000n*18n)
  }

  const nftTemplateResult = await deployer.deployContract(BurnerNFT, {
    initialFields: {
      collectionId: '',
      nftIndex: 0n,
      tokenIdBurned: '',
      amountBurned: 0n
    }
  })

  console.log('NFT template contract id: ' + nftTemplateResult.contractInstance.contractId)
  console.log('NFT template contract address: ' + nftTemplateResult.contractInstance.address)
  

  const result = await deployer.deployContract(TokenFurnace, {
  
    // The initial states of the faucet contract
    initialFields: {
      nftTemplateId: nftTemplateResult.contractInstance.contractId,
      collectionUri: stringToHex("https://arweave.net/Z1HAdT_PGnxPLct4-u7l1Zl_h4DNdxzKev7tCDAEflc"),
      totalSupply: 0n
    }
  })

  console.log('Token furnace contract id: ' + result.contractInstance.contractId)
  console.log('Token furnace contract address: ' + result.contractInstance.address)
}

export default deployFaucet