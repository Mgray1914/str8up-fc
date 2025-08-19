import { ethers } from "ethers";
import ABI from "../abi/predictionABI.json";
import {
  PREDICTION_CONTRACT_ADDRESS,
  STR8_TOKEN_ADDRESS,
} from "../config/index";
import Web3 from "web3";
import commonABI from "../abi/ABI.json";

export async function placeBet(predictionId, option, amount) {
  try {
    if (!window.ethereum) throw new Error("Wallet not found");

    const web3 = new Web3(window.ethereum);

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];

    const contract = new web3.eth.Contract(ABI, PREDICTION_CONTRACT_ADDRESS);

    const amountInWei = web3.utils.toWei(amount.toString(), "ether");
    console.log("Bet data:", predictionId, option, amountInWei);

    // Estimate gas
    const gasEstimate = await contract.methods
      .placeBet(predictionId, option, amountInWei)
      .estimateGas({ from: account });

    const gasFeeMultiplier = Number(process.env.NEXT_PUBLIC_GAS_FEE) || 1.2

    const increasedGas = Math.ceil(Number(gasEstimate) * gasFeeMultiplier); // 20% buffer

    const gasPrice = await web3.eth.getGasPrice();

    console.log(`Estimated Gas: ${gasEstimate}`);
    console.log(`Increased Gas: ${increasedGas}`);

    // Send transaction with increased gas
    const tx = await contract.methods
      .placeBet(predictionId, option, amountInWei)
      .send({
        from: account,
        gas: increasedGas,
        gasPrice
      });

    console.log("Bet placed:", tx);
    return tx;
  } catch (error) {
    console.log("Error placing bet:", error);
    throw error;
  }
}

export async function checkAndApproveAllowance(
  amount,
  userAddress,
  contractAddress = STR8_TOKEN_ADDRESS,
  abi = commonABI,
  toAddress = PREDICTION_CONTRACT_ADDRESS
) {
  const web3 = new Web3(window.ethereum);
  const tokenContract = new web3.eth.Contract(abi, contractAddress);

  const amountInWei = web3.utils.toWei(amount.toString(), "ether");
  const amountBigInt = BigInt(amountInWei);

  try {
    console.log("userAddress", userAddress, "toAddress", toAddress);
    console.log("tokenContract", tokenContract.options.address);

    const allowance = await tokenContract.methods
      .allowance(userAddress, toAddress)
      .call();
    console.log("allowance", allowance);

    const allowanceBigInt = BigInt(allowance);

    if (allowanceBigInt < amountBigInt) {
      // Estimate gas
      const gasEstimate = await tokenContract.methods
        .approve(toAddress, amountInWei)
        .estimateGas({ from: userAddress });

      const gasFeeMultiplier = Number(process.env.NEXT_PUBLIC_GAS_FEE) || 1.2

      const increasedGas = Math.ceil(Number(gasEstimate) * gasFeeMultiplier); // 20% buffer

      const gasPrice = await web3.eth.getGasPrice();

      console.log(`Estimated Gas: ${gasEstimate}`);
      console.log(`Increased Gas: ${increasedGas}`);

      const tx = await tokenContract.methods
        .approve(toAddress, amountInWei)
        .send({ from: userAddress, gas: increasedGas, gasPrice });

      console.log("Approval transaction:", tx);
    } else {
      console.log("Sufficient allowance available.", allowance);
    }

    return amountInWei;
  } catch (error) {
    console.log("Approval failed or was rejected:", error);
    throw error;
  }
}

export async function matchBet(predictionId, targetBetId) {
  try {
    if (!window.ethereum) throw new Error("Wallet not found");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];

    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(ABI, PREDICTION_CONTRACT_ADDRESS);

    console.log("Prediction Matched id:", predictionId);
    console.log("Prediction targetBetId:", targetBetId);

    const gasEstimate = await contract.methods
      .matchBet(predictionId, targetBetId)
      .estimateGas({ from: account });

    const gasFeeMultiplier = Number(process.env.NEXT_PUBLIC_GAS_FEE) || 1.2

    const increasedGas = Math.ceil(Number(gasEstimate) * gasFeeMultiplier); // 20% buffer

    const gasPrice = await web3.eth.getGasPrice();

    console.log(`Estimated Gas: ${gasEstimate}`);
    console.log(`Increased Gas: ${increasedGas}`);

    const tx = await contract.methods
      .matchBet(predictionId, targetBetId)
      .send({ from: account, gas: increasedGas, gasPrice });

    console.log("MatchBet successful:", tx);

    return {
      success: true,
      txHash: tx.transactionHash,
      receipt: tx,
    };
  } catch (error) {
    console.log("matchBet error:", error);
    throw error; // ✅ this is all you need
  }
}
