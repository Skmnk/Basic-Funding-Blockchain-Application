// async function deployFunc() {
//     console.log("Hi..!");
// }

const { network, ethers } = require("hardhat");

const {networkConfig, developmentChain, DECIMALS, INITIAL_PRICE } = require("../helper-hardhat-config")

require("dotenv").config()
const {verify} = require("../utils/verify")



// module.exports.default = deployFunc;



module.exports = async({getNamedAccounts, deployments}) =>{
   // console.log("Hi..!")
   const {deploy, log} = deployments;
   const {deployer} = await getNamedAccounts();

   const chainId = network.config.chainId;

//    console.log (chainId)
//    const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];

   let ethUsdPriceFeedAddress;

  
   if(developmentChain.includes(network.name)){

    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
   }else{
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
   }

    const args = [ethUsdPriceFeedAddress];
    
    const fundMe = await deploy("FundMe", {
      from: deployer,
      args: args,
      log: true,
      // we need to wait if on a live network so we can verify properly
      waitConfirmations: network.config.blockConfirmations || 1,
  })

   if(!developmentChain.includes(network.name) && process.env.ETHERSCAN_KEY){
    await verify(fundMe.address, args);
   }

   log("******************************************************");
}

module.exports.tags = ["all", "fundMe"]