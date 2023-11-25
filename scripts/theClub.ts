import { ethers } from 'hardhat';

const LOCAL_CONTRACT_ADDRESS = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';

async function main() {
  const theClub = await ethers.getContractAt('TheClub', LOCAL_CONTRACT_ADDRESS);
  const entryFee = await theClub.entryFee(); // entry fee

  // @ts-ignore
  const [owner, newMember] = await ethers.getSigners();
  console.log(`${ethers.parseUnits(entryFee.toString(), 'ether')}`);
  const tx = await theClub.connect(newMember).signUp();
  await tx.wait();
  // // // returns back an array with the struct values
  const member1 = await theClub.connect(newMember).members(0);
  console.log({ member1 });
  const oneEther = ethers.parseEther('.2');
  const tx2 = await theClub.connect(newMember).payDeposit({ value: oneEther });
  const result = await tx2.wait();
  const member2 = await theClub.connect(newMember).members(0);
  console.log({ member2 });

  console.log({ result });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
