import Web3 from 'web3';

import {PredictionInfo} from "../../utils/config.web3.js";

import dotenv from 'dotenv';
dotenv.config();

// Connect to the Web3Provider using the rpc url
const provider = new Web3.providers.HttpProvider(process.env.RPC_URL);

const web3 = new Web3(provider);

const privateKey = process.env.PRIVATE_KEY;

// Set the contract address and ABI
const contractAddress = PredictionInfo.address;
const contractABI = PredictionInfo.abi
// Create a new instance of the contract using the ABI and address
const contract = new web3.eth.Contract(contractABI, contractAddress);

export const startMatches = async (fixtureIds, timestamps) => {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const functionName = "setFixtureStartBunch";
    const functionArgs = [fixtureIds, timestamps];

    console.log('functionArgs', functionArgs);
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

export const endMatches = async (fixtures, results) => {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const functionName = "setFixtureResultBunch";
    const functionArgs = [fixtures, results];
    //results : 1 home, 2 away, 3 draw

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
