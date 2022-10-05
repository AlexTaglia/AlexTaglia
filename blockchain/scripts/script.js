const { ethers, upgrades } = require('hardhat');

async function main () {
  const MyNfts = await ethers.getContractFactory('MyNfts_V0');
  console.log('Deploying MyNfts_V0...');
  const myNfts = await upgrades.deployProxy(MyNfts, ["MyNft's", "MNTs"]);
  await myNfts.deployed();
  console.log('MyNfts_V0 deployed to:', myNfts.address);
}

main();
