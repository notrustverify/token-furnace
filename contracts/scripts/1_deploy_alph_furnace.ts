import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { ALPHFurnace, BurnerNFT } from '../artifacts/ts'
import { stringToHex } from '@alephium/web3'

// Deploys the ALPHFurnace contract. It reuses the BurnerNFT template that was
// already deployed in 0_deploy_faucet.ts, so nftBurnerTemplate.ral does not
// get redeployed and the existing TokenFurnace (token.ral) is untouched.
const deployAlphFurnace: DeployFunction<Settings> = async (
  deployer: Deployer,
  _network: Network<Settings>
): Promise<void> => {
  const existingNftTemplate = deployer.getDeployContractResult('BurnerNFT')
  const nftTemplateId = existingNftTemplate.contractInstance.contractId

  const result = await deployer.deployContract(ALPHFurnace, {
    initialFields: {
      nftTemplateId,
      totalSupply: 0n,
      collectionImageUri: stringToHex(
        'https://arweave.net/hoxK8xC9wRjD_6HiOzhdY2jW0ZnJoF2f0N4FcSLXqzQ'
      )
    }
  })

  console.log('ALPH furnace contract id: ' + result.contractInstance.contractId)
  console.log('ALPH furnace contract address: ' + result.contractInstance.address)
}

export default deployAlphFurnace
