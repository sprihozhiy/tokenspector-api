const CheckERC20Safety = require('../lib/checkERC20safety');
const getTokenMarketCap = require('../lib/getTokenMarketCap');
const getTokenPrice = require('../lib/getTokenPrice');
const getTokenMeta = require('../lib/getTokenMeta');

let tokenData = [];

async function retrieveData(i) {
    const card = {
        token_metadata: await getTokenMeta(i),
        token_tokenomics: await CheckERC20Safety(i),
        token_marketcap: await getTokenMarketCap(i),
        token_price: await getTokenPrice(i)
    };
    tokenData.push(card); 
}




async function getAddressData(req, res) {
    await retrieveData(req.params.address);
    res.send(tokenData);
    tokenData = [];
}

module.exports = getAddressData;