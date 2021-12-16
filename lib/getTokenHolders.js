require('dotenv').config();
const axios = require('axios');

const COVALENTHQ_API_KEY = process.env.COVALENTHQ_API_KEY;


async function getTokenHolders(address, startingBlock, endingBlock) {
    try {
      const tokenHoldersAPI = `https://api.covalenthq.com/v1/56/tokens/${address}/token_holders_changes/?quote-currency=USD&format=JSON&starting-block=${startingBlock}&ending-block=${endingBlock}&page-size=1000000&key=${COVALENTHQ_API_KEY}`
      const response = await axios.get(tokenHoldersAPI);
      const data = response.data;
      const totalHolders = data.data.items.length;
      return totalHolders;
      
    } catch (error) {
      console.error(error);
    }
  }

module.exports = getTokenHolders;