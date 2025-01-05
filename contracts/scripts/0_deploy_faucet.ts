import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { TokenFurnace, BurnerNFT } from '../artifacts/ts'
import { hexToString, NULL_CONTRACT_ADDRESS, stringToHex } from '@alephium/web3'
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
      amountBurned: 0n,
      burnedBy: NULL_CONTRACT_ADDRESS
    }
  })

  console.log('NFT template contract id: ' + nftTemplateResult.contractInstance.contractId)
  console.log('NFT template contract address: ' + nftTemplateResult.contractInstance.address)
  

  const result = await deployer.deployContract(TokenFurnace, {
  
    // The initial states of the faucet contract
    initialFields: {
      nftTemplateId: nftTemplateResult.contractInstance.contractId,
      totalSupply: 0n,
      collectionImageUri: stringToHex('https://arweave.net/hoxK8xC9wRjD_6HiOzhdY2jW0ZnJoF2f0N4FcSLXqzQ')
    }
  })

  console.log('Token furnace contract id: ' + result.contractInstance.contractId)
  console.log('Token furnace contract address: ' + result.contractInstance.address)
}

export default deployFaucet