require('dotenv').config();
const Moralis  = require('moralis/node');


const serverUrl = process.env.MORALIS_SERVER;
const appId = process.env.MORALIS_APP_ID;

Moralis.start({serverUrl, appId });


async function getTokenPrice(address) {
    try {
        const options = {
            address: address,
            chain: "bsc",
            exchange: "pancakeswap-v2"
        };
        const price = await Moralis.Web3API.token.getTokenPrice(options);
        return price.usdPrice;
    } catch (err) {
        console.log(err);
    }
}

module.exports = getTokenPrice;