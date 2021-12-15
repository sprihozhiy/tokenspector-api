require('dotenv').config();
const Moralis  = require('moralis/node');
const axios = require('axios');


const serverUrl = process.env.MORALIS_SERVER;
const appId = process.env.MORALIS_APP_ID;
const BSCSCAN_API = process.env.BSCSCAN_API;

Moralis.start({serverUrl, appId });

const BNB = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
const USDT = "0x55d398326f99059ff775485246999027b3197955";
const BUSD = "0xe9e7cea3dedca5984780bafc599bd69add087d56";

// Get current BNB Price
async function getBNBPrice() {
    try {
        const response = await axios.get(`https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${BSCSCAN_API}`);
        const data = response.data;
        const currentPrice = parseFloat(data.result.ethusd);
        return currentPrice;
    } catch (error) {
      console.error(error);
    }
}

// --------------------------------------------
// Get LP Address and Token Liquidity
// --------------------------------------------

let pairAddress = {};

// This function find the LP address
async function getPairAddress(token1, token2) {
    try {
        const options = {
            // BNB, USDT or BUSD
            token0_address: token1,
            // Token
            token1_address: token2,
            exchange: "pancakeswapv2",
            chain: "bsc"
        };
        const get_pair_token_stableCoin_address = await Moralis.Web3API.defi.getPairAddress(options);
        const pair_token_BNB_address = get_pair_token_stableCoin_address.pairAddress;
        pairAddress.token0 = get_pair_token_stableCoin_address.token0.name;
        pairAddress.decimals0 = Number(get_pair_token_stableCoin_address.token0.decimals);
        pairAddress.token1 = get_pair_token_stableCoin_address.token1.name;
        pairAddress.decimals1 = Number(get_pair_token_stableCoin_address.token1.decimals);
        pairAddress.address = pair_token_BNB_address;
        
    } catch (e) {
        pairAddress.address = null;
        console.log(e);
    }
}

async function getReservesBNB(address) {
    try {
        if(address === null) {
            console.log('BNB: No Liquidity');
            return 0;
        } else {
            const options = {
                pair_address: address.address,
                chain: "bsc"
            };
            const reserves = await Moralis.Web3API.defi.getPairReserves(options);
            const firstToken = reserves.reserve0;
            const secondToken = reserves.reserve1;
            if(address.token0 === "Wrapped BNB") {
                return (firstToken  / 10 ** 18).toFixed(2);
            } else {
                return (secondToken  / 10 ** 18).toFixed(2);
            }
        }
    } catch (e) {
        console.log(e);
    }
}

async function getReservesUSDT(address) {
    try {
        if(address.address === null) {
            console.log('USDT: No Liquidity');
            return 0;
        } else {
            const options = {
                pair_address: address.address,
                chain: "bsc"
            };
            const reserves = await Moralis.Web3API.defi.getPairReserves(options);
            const firstToken = reserves.reserve0;
            const secondToken = reserves.reserve1;
            if(address.token0 === "Tether USD") {
                return (firstToken  / 10 ** 18).toFixed(2);
            } else {
                return (secondToken  / 10 ** 18).toFixed(2);
            }
        }
    } catch (e) {
        console.log(e);
    }
}

async function getReservesBUSD(address) {
    try {
        if(address.address === null) {
            console.log('USDT: No Liquidity');
            return 0;
        } else {
        const options = {
            pair_address: address.address,
            chain: "bsc"
        };
        const reserves = await Moralis.Web3API.defi.getPairReserves(options);
        const firstToken = reserves.reserve0;
        const secondToken = reserves.reserve1;
        if(address.token0 === "BUSD Token") {
            return (firstToken  / 10 ** 18).toFixed(2);
        } else {
            return (secondToken  / 10 ** 18).toFixed(2);
            }
        }
    } catch (e) {
        console.log(e);
    }
}

async function getTotalLiquidity(address) {
    try {
        const bnbLiquidity = await getPairAddress(address, BNB).then(()=>getReservesBNB(pairAddress));
        const bnbPrice = await getBNBPrice();
        const usdtLiquidity = await getPairAddress(address, USDT).then(()=>getReservesUSDT(pairAddress));
        const busdLiquidity = await getPairAddress(address, BUSD).then(()=>getReservesBUSD(pairAddress));
        const totalLiquidity = (parseFloat(bnbLiquidity) * parseFloat(bnbPrice)) + parseFloat(usdtLiquidity) + parseFloat(busdLiquidity);
        // console.log(`Liquidity. BNB: ${bnbLiquidity}, USDT: ${usdtLiquidity}, BUSD: ${busdLiquidity}`);
        return { BNB: bnbLiquidity, USDT: usdtLiquidity, BUSD: busdLiquidity, total: totalLiquidity };
    } catch(e) {
        console.log(e);
    }
}

module.exports = getTotalLiquidity;