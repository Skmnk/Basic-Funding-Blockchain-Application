const networkConfig ={
    11155111: {
        name : "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    31337: {
        name: "localhost",
        // Mock price feed address will be set during deployment
    }
}

const developmentChain = ["hardhat", "localhost"];
const DECIMALS = "8"
const INITIAL_PRICE = "200000000000"


module.exports = {
    networkConfig,
    developmentChain,
    DECIMALS,
    INITIAL_PRICE


}