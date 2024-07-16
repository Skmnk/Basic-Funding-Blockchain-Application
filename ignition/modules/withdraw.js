const {getNamedAccounts, ethers} = require("hardhat");

async function main(){

    const {deployer} = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);
    console.log("processing...")

    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait();
    console.log("got it back")
}

main().then(() => process.exit(0)).catch((error) => {

    console.error(error);
    process.exit(1);
  });
