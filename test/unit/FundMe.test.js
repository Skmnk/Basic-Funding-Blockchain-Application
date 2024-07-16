const { assert, expect } = require("chai")
const {deployments, ethers, getNamedAccounts} = require("hardhat")
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const { developmentChain } = require("../../helper-hardhat-config")



!developmentChain.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function (){
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1")

    beforeEach(async function(){
        //or 
        // const accounts = await ethers.getSigners();
        // const accountZero = accounts[0];
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe",deployer);
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor", async function(){
        it("sets aggregate address correctly", async function(){
            const response = await fundMe.priceFeed;

            assert.equal(response, mockV3Aggregator.address);
        })
    })

    describe("fund", async function(){
        it("fails if you dont send enough eth", async function() {
            await expect(ethers.fundMe.fund()).to.be.revertedWith("You need to spend enough ether")
        })
        it("updates the amount funded", async function(){
            await fundMe.fund({
                value : sendValue
            })

            const response = await fundMe.addressToAmountFunded(
                deployer
            )

            assert.equal(response.toString(),sendValue.toString())
        })

        it("adds funders to funders array", async function(){
            await fundMe.fund({
                value : sendValue
            })
            const funder = await fundMe.funders[0];
            assert.equal(funder,deployer);
        })
    })

    describe("withdraw", async function(){
        beforeEach(async function (){
            await fundMe.fund({
                value : sendValue
            })
        })

        it("withdraw eth form a single founder", async function(){
            //arrange
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

            //act
            const transactionResponse = await fundMe.withdraw();
            const transactionReciept = await transactionResponse.wait(1);
            const {gasUsed, effectiveGasPrice} = transactionReciept
            const gasCost =  gasUsed.mul(effectiveGasPrice);
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

            //assert
            assert.equal(endingFundMeBalance ,0)
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString() , endingDeployerBalance.add(gasCost).toString())

        })

        it("allows us to withdraw from multiple accounts", async function(){
            // arrange
            for (i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

            //act
            const transactionResponse = await fundMe.withdraw();
            const transactionReciept = await transactionResponse.wait(1);
            const {gasUsed, effectiveGasPrice} = transactionReciept
            const gasCost =  gasUsed.mul(effectiveGasPrice);
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

            // assert
            assert.equal(endingFundMeBalance ,0)
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString() , endingDeployerBalance.add(gasCost).toString())

            // make sure funders are reset

            await expect(fundMe.funders(0)).to.be.reverted

            for (i = 1; i < 6; i++) {
               assert.equal(await fundMe.addressToAmountFunded(accounts[i].address),0)
            }
        })

        it("only allows the owner to withdraw", async function(){
            const accounts = await ethers.getSigners();
            const attacker = accounts[1];
            const attackerConnectedContract = await fundMe.connect(attacker);
           await expect(attackerConnectedContract.withdraw()).to.be.revertedWith("sender is not owner")
        })
    })

    
})

