require('dotenv').config();
const Moralis  = require('moralis/node');

const serverUrl = process.env.MORALIS_SERVER;
const appId = process.env.MORALIS_APP_ID;
Moralis.start({serverUrl, appId });

async function getTokenMeta(address) {
    try {
        const options = {chain: "bsc", addresses: address};
        const tokenMetadata = await Moralis.Web3API.token.getTokenMetadata(options);
        return tokenMetadata;
    } catch (err) {
        console.log(err);
    }
}

module.exports = getTokenMeta;