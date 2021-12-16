require('dotenv').config();
const axios = require('axios');

const COVALENTHQ_API_KEY = process.env.COVALENTHQ_API_KEY;


async function getTokenFirstTxn(address) {
    try {
      const transactionsAPI = `https://api.covalenthq.com/v1/56/address/${address}/transactions_v2/?no-logs=true&block-signed-at-asc=false&page-size=100000000&format=JSON&key=${COVALENTHQ_API_KEY}`
      const response = await axios.get(transactionsAPI);
      const data = response.data;
      // console.log(data);
      const itemsLngth = data.data.items.length;
      const firstTrx = data.data.items[itemsLngth - 1];
      // console.log(firstTrx);
      const firstTrxData = {
        createdAt: firstTrx.block_signed_at,
        blockHeightCreation: firstTrx.block_height,
        trnxHash = firstTrx.tx_hash, 
      }
      return firstTrxData;
      
    } catch (error) {
      console.error(error);
    }
  }

  module.exports = getTokenFirstTxn;