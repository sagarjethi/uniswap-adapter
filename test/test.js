/**
 * Fork mainnet to run tests
 * 
 * npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/<YOUR_ALCHEMY_KEY>
 * npx hardhat test
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UniswapAmmAdapter", function() {
  beforeEach( async() => {

     /* ============ Usefull Addresses ============ */
    tokenA = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"; //WETH
    tokenB = "0x0aacfbec6a24756c20d41914f2caba817c0d8521"; //YAM
    pool   = "0xe2aAb7232a9545F29112f9e6441661fD6eEB0a5d"; // WETH-YAM Liquidity Pool
    nonMatchingPool   = "0x88D97d199b9ED37C29D846d00D443De980832a22"; // WETH-UMA Liquidity Pool
    invalidPool   = "0x15abb66ba754f05cbc0165a64a11cded1543de48"; // A wallet address


     /* ============ Create Contract Instance ============ */
    uinswapV2Router02 = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const uniswapV2Factory  = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const UniswapAmmAdapter = await ethers.getContractFactory("UniswapAmmAdapter");

    uniswapAmmAdapter = await UniswapAmmAdapter.deploy(uinswapV2Router02,uniswapV2Factory);
    await uniswapAmmAdapter.deployed();

  });


  it("Should return ProvideLiquidity calldata", async function() {

    let provideLiqCalldata = await uniswapAmmAdapter.getProvideLiquidityCalldata(
      pool,
      [tokenA,tokenB],
      ["1000000000000000","1000000000000000000"],
      "2000000000000000000"
    );
   
    expect(provideLiqCalldata).to.have.lengthOf(3);

  });
  
  it("Should return RemoveLiquidity calldata", async function() {

    let removeLiqCalldata = await uniswapAmmAdapter.getRemoveLiquidityCalldata(
        pool,
        [tokenA,tokenB],
        ["1000000000000000","1000000000000000000"],
        "2000000000000000000"
      );
    
    expect(removeLiqCalldata).to.have.lengthOf(3);

  });

  it("Should revert getProvideLiquidityCalldata when passing an invalid pool", async function() {

    await expect(uniswapAmmAdapter.getProvideLiquidityCalldata(
      invalidPool,
      [tokenA,tokenB],
      ["1000000000000000","1000000000000000000"],
      "2000000000000000000"  
    )).to.be.revertedWith("No pool found for token pair");

  });

  it("Should revert getRemoveLiquidityCalldata when passing an invalid pool", async function() {

    await expect(uniswapAmmAdapter.getRemoveLiquidityCalldata(
      invalidPool,
      [tokenA,tokenB],
      ["1000000000000000","1000000000000000000"],
      "2000000000000000000"  
    )).to.be.revertedWith("No pool found for token pair");

  });

  it("Should revert getProvideLiquidityCalldata when pool does not match token pair", async function() {

    await expect(uniswapAmmAdapter.getProvideLiquidityCalldata(
      nonMatchingPool,
      [tokenA,tokenB],
      ["1000000000000000","1000000000000000000"],
      "2000000000000000000"  
    )).to.be.revertedWith("Pool does not match token pair");

  });

  it("Should revert getRemoveLiquidityCalldata when pool does not match token pair", async function() {

    await expect(uniswapAmmAdapter.getRemoveLiquidityCalldata(
      nonMatchingPool,
      [tokenA,tokenB],
      ["1000000000000000","1000000000000000000"],
      "2000000000000000000"  
    )).to.be.revertedWith("Pool does not match token pair");

  });

  it("Should revert getProvideLiquiditySingleAssetCalldata", async function() {

    await expect(uniswapAmmAdapter.getProvideLiquiditySingleAssetCalldata(
      pool,
      tokenA,
      "1000000000000000",
      "2000000000000000000"  
    )).to.be.revertedWith("Uniswap pools require a token pair");

  });

  it("Should revert getRemoveLiquiditySingleAssetCalldata", async function() {

    await expect(uniswapAmmAdapter.getRemoveLiquiditySingleAssetCalldata(
      pool,
      tokenA,
      "1000000000000000",
      "2000000000000000000"  
    )).to.be.revertedWith("Uniswap pools require a token pair");

  });

  it("Should return address of UinswapV2Router02", async function() {
    const router = await uniswapAmmAdapter.getSpenderAddress("0x0000000000000000000000000000000000000000");
    expect(router).to.equal(uinswapV2Router02);
  });

  it("Should check id pool is valid", async function() {
    const goodPool = await uniswapAmmAdapter.isValidPool(pool) ;
    expect(goodPool).to.equal(true);

    const badPool = await uniswapAmmAdapter.isValidPool(invalidPool) ;
    expect(badPool).to.equal(false);

  });


});
