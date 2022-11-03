// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const WALLET = await hre.ethers.getContractFactory("Wallet");
  const wallet = await Greeter.deploy((WALLET, ["0xCd1B7F97D975Cfd5e4777f59f9BCC146d5D19dFE", "0xA968FACD9d9090addB515977579F53A45f3a792f", "0xdA200867a023EEdB08aAB17f0417AF950ac719E5"], 2));

  await wallet.deployed();

  console.log("wallet deployed to:", wallet.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
