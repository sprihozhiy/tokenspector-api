const CheckERC20Safety = require('../lib/checkERC20safety');
const getTokenMarketCap = require('../lib/getTokenMarketCap');
const getTokenPrice = require('../lib/getTokenPrice');
const getTokenMeta = require('../lib/getTokenMeta');
const getTokenLiquidity = require('../lib/getTokenLiquidity');
const getTokenTxnAndHolders = require('../lib/getTokenTxnAndHolders');

let tokenData = [];

async function retrieveData(i) {
    try {
        const card = {
            token_metadata: await getTokenMeta(i),
            token_tokenomics: await CheckERC20Safety(i),
            token_marketcap: await getTokenMarketCap(i),
            token_price: await getTokenPrice(i),
            token_liquidity: await getTokenLiquidity(i),
            token_txn_holders: await getTokenTxnAndHolders(i)
        };
        tokenData.push(card);
    } catch (err) {
        console.log(err);
    }
     
}

async function getAddressData(req, res) {
    try {
        await retrieveData(req.params.address);
        res.send(tokenData);
        tokenData = [];
    } catch(err) {
        console.log(err);
    }
}

module.exports = getAddressData;