import React from 'react'
// import AllOutIcon from '@material-ui/icons/AllOut';
// import DoneIcon from '@material-ui/icons/Done';
// import EcoIcon from '@material-ui/icons/Eco';
// import LockIcon from '@material-ui/icons/Lock';


// const Style = "text-white text-xs"

const arrayIcon = [<img src="binance-white.png" alt="Binance" />, <img src="kucoin-white.png" alt="KuCoin" />, <img src="gcash-white.png" alt="GCash" />]
const Color = ["from-gray-800 to-yellow-400", "from-green-600 to-green-400", "from-blue-600 to-blue-300"]


const Card = (props) => {
    // var phpbalance = props.phpbalance;
    // var usdbalance = props.usdbalance;
    // balance = balance * 9.5;



    return (
        <div className={`transform hover:scale-110 cursor-pointer transition delay-100 w-3/12  p-2 py-4 shadow-xl  border rounded-xl bg-gradient-to-r ${Color[props.icon]}`} >
            <div className="flex justify-between">
                <div></div>
                <div className=" w-10  h-10 flex items-center justify-center  bg-gray-300 rounded-xl m-1  bg-opacity-30 card-icon">
                    {arrayIcon[props.icon]}
                </div>
            </div>
            <p className="text-gray-200 text-xs  ">
                {props.title}
            </p>
            <p className="text-gray-50 text-lg  font-semibold  ">
                {props.usdbalance} USDT
            </p>
            <p className="text-gray-300  text-sm ">
                PHP {props.phpbalance}
            </p>






        </div>
    )
}

export default Card
