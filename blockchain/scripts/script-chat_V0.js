const { ethers, upgrades } = require('hardhat');

async function main () {
  const CHAT = await ethers.getContractFactory('Chat_V0');
  console.log('Deploying chat contract...');
  const chat = await upgrades.deployProxy(CHAT);
  await chat.deployed();
  console.log('chat deployed to:', chat.address);
}

main();