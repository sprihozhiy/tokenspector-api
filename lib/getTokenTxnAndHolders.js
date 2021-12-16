require('dotenv').config();
const axios = require('axios');

const COVALENTHQ_API_KEY = process.env.COVALENTHQ_API_KEY;
const getTokenHolders = require('./getTokenHolders');


async function getTokenTxnAndHolders(address) {
    try {
      const transactionsAPI = `https://api.covalenthq.com/v1/56/address/${address}/transactions_v2/?no-logs=true&block-signed-at-asc=false&page-size=100000000&format=JSON&key=${COVALENTHQ_API_KEY}`
      const response = await axios.get(transactionsAPI);
      const data = response.data;
      const itemsLngth = data.data.items.length;
      const firstTrx = data.data.items[itemsLngth - 1];
      const lastTrx = data.data.items[0];
      const startingBlock = firstTrx.block_height;
      const endingBlock = lastTrx.block_height;

      const totalHoldersNumber = await getTokenHolders(address, startingBlock, endingBlock);

      const trxnAndHoldersData = {
        createdAt: firstTrx.block_signed_at,
        blockHeightCreation: firstTrx.block_height,
        trnxHash: firstTrx.tx_hash,
        totalHolders: totalHoldersNumber
      }
      return trxnAndHoldersData;
      
    } catch (error) {
      console.error(error);
    }
  }


  module.exports = getTokenTxnAndHolders;