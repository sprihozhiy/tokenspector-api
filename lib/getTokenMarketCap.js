require('dotenv').config();
const axios = require('axios');
const Moralis  = require('moralis/node');
const { GraphQLClient, gql }  = require('graphql-request');

const serverUrl = process.env.MORALIS_SERVER;
const appId = process.env.MORALIS_APP_ID;
const BSCSCAN_API = process.env.BSCSCAN_API;
Moralis.start({serverUrl, appId });

// Get Total Burned Tokens

async function getBurnedTotal(addressToken) {
    try {
      const endpoint = 'https://graphql.bitquery.io';

      const variables = {
          burnAddress: "0x000000000000000000000000000000000000dead",
          tokenAddress: addressToken
      };
      
      const client = new GraphQLClient(endpoint, {
      headers: {
          'X-API-KEY': process.env.BITQUERY_API,
          },
      });
  
      const query = gql`
          query getBurned($burnAddress: String!, $tokenAddress: String! )
          {
              ethereum(network: bsc) {
                  address(
                      address: {is: $burnAddress}
                  ) {
                      address
                      balances(
                      currency: {is: $tokenAddress}
                      )   {
                      value
                          }
                      }
              }
          }
      `
      const data = await client.request(query, variables);
      let totalBurnt = 0;
      if (data === undefined) {
        return totalBurnt;
      } else {
        totalBurnt = data.ethereum.address[0].balances[0].value;
        return totalBurnt;
      }
    //   

    } catch (error) {
        console.log(error);
    }
}

// Get Total Supply

async function getTotalSupply(address) {
    try {
        const response = await axios.get(`https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=${address}&apikey=${BSCSCAN_API}`);
        const options = {chain: "bsc", addresses: address};
        const tokenMetadata = await Moralis.Web3API.token.getTokenMetadata(options);
        const tokenDecimals = Number(tokenMetadata[0].decimals);
        const data = response.data;
        const totalSupplyRaw = data.result;
        const totalSupply = totalSupplyRaw / 10 ** tokenDecimals;
        return totalSupply;

    } catch (error) {
      console.error(error);
    }
}

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

// Get Token Market Cap

async function getTokenMarketCap(address) {
    try {
        const supply = await getTotalSupply(address);
        const price = await getTokenPrice(address);
        const burnt = await getBurnedTotal(address);
        let marketCap = 0;
        if(burnt === undefined) {
            marketCap = supply * price;
        } else {
            marketCap = (supply - burnt) * price;
        }
        // console.log(marketCap);
        return marketCap;
    } catch(err) {
        console.log(err);
    }
}


module.exports = getTokenMarketCap;