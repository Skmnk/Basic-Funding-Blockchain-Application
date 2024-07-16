const {network} = require("hardhat");
const {developmentChain,INITIAL_PRICE,DECIMALS} = require("../helper-hardhat-config");

module.exports = async({getNamedAccounts, deployments}) =>{
    // console.log("Hi..!")
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
 
    const chainId = network.config.chainId;


    if(developmentChain.includes(network.name)){
        console.log("local chain detected, deployment mocks...");
        await deploy("MockV3Aggregator", {
            contract : "MockV3Aggregator",
            log: true,
            from: deployer,
            args: [DECIMALS, INITIAL_PRICE]
        })
        log("Mocks Deployed");
        log("------------------------------------------------");
    }

 
}

module.exports.tags = ["all", "mocks"];