const { assert, expect } = require("chai")
const { network, ethers, getNamedAccounts } = require("hardhat")
const {ethers} = require("ethers");
const { developmentChain } = require("../../helper-hardhat-config")

developmentChain.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", function () {
          let deployer
          let fundMe
          const sendValue = ethers.utils.parseEther("1")


          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })
          it("allows people to fund and withdraw", async function () {
            await fundMe.fund({
                value: sendValue,
            })
            await fundMe.withdraw();

            // const fundTxResponse = await fundMe.fund({ value: sendValue })
            // await fundTxResponse.wait(1)
            // const withdrawTxResponse = await fundMe.withdraw()
            // await withdrawTxResponse.wait(1)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            // console.log(
            //     endingFundMeBalance.toString() +
            //         " should equal 0, running assert equal..."
            // )
            assert.equal(endingFundMeBalance.toString(), "0")
        })
    })