import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  network,
  ethers,
}: HardhatRuntimeEnvironment) {
  const theClub = await ethers.deployContract('TheClub');

  console.log(await theClub.getAddress());
};
export default func;
