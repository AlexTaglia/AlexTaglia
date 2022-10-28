const { ethers, upgrades } = require('hardhat');

async function main () {
  const NFT721 = await ethers.getContractFactory('alexTagliaNfts_V0');
  console.log('Deploying NFT721 contract...');
  const nft = await upgrades.deployProxy(NFT721, ["alexTaglia", "ATV"]);
  await nft.deployed();
  console.log('NFT721 deployed to:', nft.address);
}

main();