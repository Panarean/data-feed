import Web3 from 'web3';

import {RaffleInfo} from "../../utils/config.web3.js";

import dotenv from 'dotenv';
dotenv.config();

// Connect to the Web3Provider using the rpc url
const provider = new Web3.providers.HttpProvider(process.env.RPC_URL);

const web3 = new Web3(provider);

const privateKey = process.env.PRIVATE_KEY;

// Set the contract address and ABI
const contractAddress = RaffleInfo.address;
const contractABI = RaffleInfo.abi;
// Create a new instance of the contract using the ABI and address
const contract = new web3.eth.Contract(contractABI, contractAddress);

export const fetchRaffles = async () => {
    const now = new Date().getTime();
    try {
        const result = await contract.methods.getRaffles().call();
        let drawableRaffles = [];
        let cancelableRaffles = [];

        result.forEach((raffle) => {
            if (raffle.expirationTime * 1000 < now) {
                if (raffle.status == 0 && Number(raffle.currentSupply) > 0) {
                    drawableRaffles.push(raffle.raffleId);
                } else {
                    if (raffle.status != 1 && Number(raffle.currentSupply) === 0 ) {
                        cancelableRaffles.push(raffle.raffleId);
                    }
                }
            }
        });

        if (drawableRaffles.length > 0) {
            console.log("draw", drawableRaffles);
            await handleDraw(drawableRaffles);
        }
        if (cancelableRaffles.length > 0) {
            console.log("cancel", cancelableRaffles);
            await handleCancel(cancelableRaffles);
        }

    } catch (e) {
        console.log('err', e)
    }
}

const handleDraw = async (raffleId) => {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const functionName = "batchDraw";
    const functionArgs = [raffleId];
    const txObject = {
        from: account.address,
        to: contractAddress,
        data: contract.methods[functionName](...functionArgs).encodeABI(),
        gas: web3.utils.toHex(3000000),
    }

    web3.eth.accounts.signTransaction(txObject, privateKey).then((signedTx) => {
        web3.eth.sendSignedTransaction(signedTx.rawTransaction).then((tx) => {
            console.log(tx);
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
}

const handleCancel = async (raffleIds) => {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const functionName = "batchCancelRaffle";
    const functionArgs = [raffleIds];
    const txObject = {
        from: account.address,
        to: contractAddress,
        data: contract.methods[functionName](...functionArgs).encodeABI(),
        gas: web3.utils.toHex(3000000),
    }

    web3.eth.accounts.signTransaction(txObject, privateKey).then((signedTx) => {
        web3.eth.sendSignedTransaction(signedTx.rawTransaction).then((tx) => {
            console.log(tx);
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
}
