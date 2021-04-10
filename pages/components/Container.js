import React from 'react'

import Card from './Card'
import Middle from './Middle'
import RightBar from './RightBar'

// import '../api/kucoinapi'



const Container = ({php,usd}) => {
    return (
        <div className=" bg-gradient-to-r from-gray-100 to-gray-50 h-full " >
            <div className="  px-8 py-1 ">
                <p className="text-gray-500 text-lg">
                    Hi!
            </p>
                <p className="font-bold text-2xl transform -translate-y-2">
                    Farhan
            </p>
            </div>
            <div className="flex   p-4 space-x-3">
                <Card title="BINANCE" phpbalance={php} usdbalance={php} icon={0} />
                <Card title="KuCOIN" phpbalance={php} usdbalance={php} icon={1} />
                <Card title="GCASH" phpbalance={php} usdbalance={php} icon={2} />
                {/* <Card title="DELEGATED" balance={339.0790} icon={3} /> */}

            </div>
            <div className="flex  ml-3 mt-6 space-x-6  mr-4">
                <Middle />
                <RightBar />
            </div>
        </div>
    )
}

export async function getStaticProps() {
    const crypto = require('crypto');
    var axios = require('axios');

    const baseURL = "https://api.kucoin.com";
    const userDetailURL = '/api/v1/accounts';

    const apiTimeStamp = Date.now();

    const apiStringToSignUD = apiTimeStamp + 'GET' + userDetailURL;

    const apiSignature = crypto.createHmac('sha256', process.env.KC_API_SECRET).update(apiStringToSignUD).digest('base64');

    const options = {
        "KC-API-SIGN": apiSignature,
        "KC-API-TIMESTAMP": apiTimeStamp,
        "KC-API-KEY": process.env.KC_API_KEY,
        "KC-API-PASSPHRASE": process.env.KC_API_PASSPHRASE
    }

    axios.get('https://api.coingecko.com/api/v3/coins/list?include_platform=false')
        .then(response => {
            const coin_list = response.data;
            axios.get(baseURL + userDetailURL, { headers: options })
                .then(response => {
                    // If request is good...
                    // console.log(response.data.data);
                    let myCoins = [];
                    let promises = [];
                    let content = [];
                    for (let i = 0; i < response.data.data.length; i++) {
                        const currency = response.data.data[i].currency.toLowerCase();
                        const balance = response.data.data[i].balance;
                        const type = response.data.data[i].type;
                        let new_currency = "";
                        // code for coin change
                        coin_list.forEach(coin => {
                            if (coin.symbol == currency) {
                                new_currency = coin.id;
                            } else { }
                        });
                        promises.push(
                            axios.get('https://api.coingecko.com/api/v3/simple/price?ids=' + new_currency + '&vs_currencies=php%2Cusd')
                                .then(response => {
                                    // If request is good...
                                    // console.log(balance);
                                    const phpMultiplier = response.data[new_currency].php;
                                    const myPhpConvert = Math.round(((balance * phpMultiplier) + Number.EPSILON) * 1000000) / 1000000;
                                    const usdMultiplier = response.data[new_currency].usd;
                                    const myUsdConvert = Math.round(((balance * usdMultiplier) + Number.EPSILON) * 1000000) / 1000000;
                                    // console.log("(" + type + ")" + currency + ': ' + balance + " = php: " + myPhpConvert + ' = usd: ' + myUsdConvert);
                                    myCoins.push({
                                        'type': type,
                                        'abbv': currency,
                                        'name': new_currency,
                                        'balance': balance,
                                        'php': myPhpConvert,
                                        'usd': myUsdConvert
                                    })
                                })
                                .catch((error) => {
                                    console.log('error ' + error);
                                })
                        )
                    }
                    Promise.all(promises).then(() => {
                        // Use datas from here
                        // console.log(myCoins)
                        let totalMainPhp = 0;
                        let totalTradePhp = 0;
                        let totalMainUsd = 0;
                        let totalTradeUsd = 0;
                        myCoins.forEach(coin => {
                            if (coin.type == "main") {
                                totalMainPhp += coin.php
                                totalMainUsd += coin.usd
                            } else if (coin.type == "trade") {
                                totalTradePhp += coin.php
                                totalTradeUsd += coin.usd
                            } else { }
                        })
                        // console.log(totalMainPhp, totalTradePhp,totalMainUsd, totalTradeUsd)
                        const totalKucoinPhp = totalMainPhp + totalTradePhp;
                        const totalKucoinUsd = totalMainUsd + totalTradeUsd;
                        return {
                            props: { "php":totalKucoinPhp, "usd" :totalKucoinUsd }
                        }
                        // content.push({ "php":totalKucoinPhp, "usd" :totalKucoinUsd });
                    })
                    console.log(content)
                    // return content;
                })
                .catch((error) => {
                    console.log('error ' + error);
                })
            // return response;
        })
        .catch((error) => {
            console.log('error ' + error);
        })
        // console.log(response)
//         const res = await fetch(`https://api.coingecko.com/api/v3/coins/list?include_platform=false`)
//   const data = await res.json()

//   if (!data) {
//     return {
//       notFound: true,
//     }
//   }
//   console.log(data);
//   return {
//     props: { data }, // will be passed to the page component as props
//   }
}

export default Container
