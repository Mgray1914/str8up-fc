import { ethers } from "ethers";
import ABI from "../abi/ABI.json";
import toast from "react-hot-toast";
import { fromWei } from "web3-utils";
import { callApi } from "../services/apiServices";

export const detectWallet = (type = "metamask") => {
  try {
    if (typeof window == "undefined" || !window.ethereum) return null;
    const providers = window.ethereum.providers;
    console.log("Providers", providers);
    console.log("window", window.ethereum);
    if (Array.isArray(providers)) {
      return providers.find((p) => {
        if (type === "metamask") {
          console.log("checkProvider meta1")
          return (
            p.isMetaMask &&
            !p.isCoinbaseWallet &&
            !p.isTrust &&
            !p.isTrustWallet
          );
        } else if (type === "coinbase") {
          console.log("checkProvider coin1")
          return (
            p.isCoinbaseWallet &&
            !p.isMetaMask &&
            !p.isTrust &&
            !p.isTrustWallet
          );
        }
        return false;
      });
    }
    if (type === "metamask") {
          console.log("checkProvider meta2")
      return window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet
        ? window.ethereum
        : null;
    }

    if (type === "coinbase") {
          console.log("checkProvider coin2")
      return window.ethereum.isCoinbaseWallet && !window.ethereum.isMetaMask
        ? window.ethereum
        : null;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

export function formatTimestampToDate(timestamp) {
  const date = new Date(timestamp);
  const options = { month: "short", day: "2-digit", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

export function formatTimestampToTime(timestamp) {
  const date = new Date(timestamp);
  const options = { hour: "numeric", minute: "2-digit", hour12: true };
  return date.toLocaleTimeString("en-US", options);
}

export async function getTokenBalance(recipient, browserProvider) {
  const contractAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
  try {
    const ethersProvider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_BASE_RPC_URL
    );
    const contract = new ethers.Contract(contractAddress, ABI, ethersProvider);
    const [rawBalance, decimals, symbol] = await Promise.all([
      contract.balanceOf(recipient),
      contract.decimals(),
      contract.symbol(),
    ]);
    const balance = ethers.formatUnits(rawBalance, decimals);
    const fixedBalance = parseFloat(balance).toFixed(2);
    return {
      balance: fixedBalance || "0.00",
      symbol: symbol || "",
    };
  } catch (error) {
    console.log("get Balance Error", error);
    return {
      balance: "0.00",
      symbol: "",
    };
  }
}

export async function getTokenInfo() {
  const contractAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
  try {
    const ethersProvider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_BASE_RPC_URL
    );
    const contract = new ethers.Contract(contractAddress, ABI, ethersProvider);
    const [decimals, symbol] = await Promise.all([
      contract.decimals(),
      contract.symbol(),
    ]);

    return {
      decimals: decimals || "0",
      symbol: symbol || "",
    };
  } catch (error) {
    console.log("get Balance Error", error);
    return {
      decimals: "0",
      symbol: "",
    };
  }
}

export function trimAddress(address, start = 6, end = 6) {
  if (!address || address.length < start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function copyToClipboard(text) {
  if (!text) return;

  if (typeof window === "undefined" || !navigator?.clipboard) {
    console.warn("Clipboard API not available.");
    return;
  }
  if (!document.hasFocus()) {
    console.warn("Cannot copy: document not focused");
    return;
  }
  const copy = navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Copied to clipboard:", text);
      toast.success("Copied!");
    })
    .catch((err) => {
      console.error("Copy failed:", err);
      // toast.error("Copy failed");
    });
}

// export const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     toast.success("copied")
// }

export function trimWithEllipsis(str, limit = 10) {
  if (!str) return "";
  if (typeof str !== "string") return "";
  if (str.length <= limit) return str;
  return str.slice(0, limit) + "...";
}

export const formatDollarSTR8 = (amount) => {
  if (isNaN(amount)) return "$0STR8";

  const hasDecimal = amount % 1 !== 0;

  const formatted = amount?.toLocaleString("en-US", {
    minimumFractionDigits: hasDecimal ? 2 : 0,
    maximumFractionDigits: hasDecimal ? 2 : 0,
  });

  return `$${formatted} STR8`;
};

export const formatWithDollar = (amount) => {
  if (isNaN(amount)) return "$0";

  const hasDecimal = amount % 1 !== 0;

  const formatted = amount?.toLocaleString("en-US", {
    minimumFractionDigits: hasDecimal ? 2 : 0,
    maximumFractionDigits: hasDecimal ? 2 : 0,
  });

  return `$${formatted}`;
};

export function formatFromWei(weiAmount, unit = "ether") {
  try {
    if(weiAmount){
      return fromWei(weiAmount?.toString(), unit); // ✅ now it's calling web3's fromWei
    }else{
      return "-"
    }
  } catch (err) {
    console.error("Error converting from wei:", err);
    return "-";
  }
}

export const Transaction = async (blockNumber, eventType) => {
  try {
    const response = await callApi({
      method: "post",
      url: "/transactions",
      data: {
        latestBlock: parseInt(blockNumber),
      },
      params: {
        eventType: eventType,
      },
    });
    console.log("createTransaction response", response);
    return response;
  } catch (error) {
    console.error("createTransaction error", error);
    throw error;
  }
};

export function isLocalTimePastUtcInput(targetUtcDateTimeString) {
  const nowLocal = new Date(); // current local time
  const targetLocal = new Date(targetUtcDateTimeString); // still a Date object — interpreted in local time when compared

  return nowLocal >= targetLocal;
}
