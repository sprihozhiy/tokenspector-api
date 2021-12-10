const Web3 = require('web3');
require('dotenv').config();

const BSC_NODE_API = process.env.BSC_NODE_API;

const CheckERC20Safety = async (address) => {
    const provider = new Web3.providers.HttpProvider(BSC_NODE_API);
    const web3 = new Web3(provider);

    let bnbIN = web3.utils.toWei("0.5", "ether");

    let encodedAddress = web3.eth.abi.encodeParameter("address", address);
    let contractFuncData = "0xd66383cb";
    let callData = contractFuncData + encodedAddress.substring(2);
    try {
        const result = await web3.eth.call({
          to: "0x2bf75fd2fab5fc635a4c6073864c708dfc8396fc", // Honeypot checker contract
          from: "0x8894e0a0c962cb723c1976a4421c95949be2d4e3",
          value: bnbIN,
          gas: 45000000,
          data: callData,
        });
  
        if (result) {
          let decoded = web3.eth.abi.decodeParameters(
            ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256"],
            result
          );
          let buyExpectedOut = web3.utils.toBN(decoded[0]);
          let buyActualOut = web3.utils.toBN(decoded[1]);
          let sellExpectedOut = web3.utils.toBN(decoded[2]);
          let sellActualOut = web3.utils.toBN(decoded[3]);
          let buyGasUsed = web3.utils.toBN(decoded[4]).toNumber();
          let sellGasUsed = web3.utils.toBN(decoded[5]).toNumber();
          let buy_tax =
            Math.round(
              ((buyExpectedOut - buyActualOut) / buyExpectedOut) * 100 * 10
            ) / 10;
          let sell_tax =
            Math.round(
              ((sellExpectedOut - sellActualOut) / sellExpectedOut) * 100 * 10
            ) / 10;
          if (buy_tax + sell_tax > 50) {
            // Extreme high tax
            return { isHonepot: "Yes", buyTax: buy_tax, sellTax: sell_tax };
          }
  
          if (buyGasUsed + sellGasUsed >= 45000000 * 0.8) {
            // Extreme high gas
            return { isHonepot: "Yes", buyTax: buy_tax, sellTax: sell_tax };
          }
  
          return { isHonepot: "No", buyTax: buy_tax, sellTax: sell_tax };

        }
      } catch (error) {
        const message = error.message;
  
        if (message) {
          if (message.includes("TRANSFER_FROM_FAILED")) {
            return { isHonepot: "Yes", buyTax: 0, sellTax: 0 };
          }
        }
      }
}

module.exports = CheckERC20Safety;