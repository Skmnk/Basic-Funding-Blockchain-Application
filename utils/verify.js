const { hardhatArguments, network } = require("hardhat");

const {ethers, run} = require("hardhat");
const {JsonRpcProvider, Contract} = require("ethers");
const { ConstructorFragment, getContractAddress } = require("ethers/lib/utils");
require("dotenv").config();

async function verify(contractAddress, args){
    console.log("Verifying contract ....");
    try{
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
  
    });
  } catch (e) {
    if(e.message.toLowerCase().includes("already verified")){
      console.log("already verified");
    }else{
      console.log(e);
    }
  }
  
  }

  module.exports = {verify};