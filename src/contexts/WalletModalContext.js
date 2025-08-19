// contexts/WalletModalContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { callApi } from "../services/apiServices";
import Cookies from 'js-cookie'

const WalletModalContext = createContext();

export const WalletModalProvider = ({ children }) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [provider, setProvider] = useState("");
  const [balance, setBalance] = useState("");
  const [userProfile, setUserProfile] = useState();
  const token = Cookies.get("token")

  const fetchProfile = async () => {
    try {
      const response = await callApi({
        method: "get",
        url: "/users",
      });
      setUserProfile(response.data.user)
    } catch (err) {}
  };

  useEffect(() => {
    if(token) fetchProfile();
  }, [token]);

  const value = {
    isWalletModalOpen, setIsWalletModalOpen,
    walletAddress,setWalletAddress,
    isWalletConnected,setIsWalletConnected,
    provider, setProvider,
    balance,setBalance,
    userProfile, setUserProfile,
    fetchProfile
  }

  return (
    <WalletModalContext.Provider value={value}>
      {children}
    </WalletModalContext.Provider>
  );
};

export const useGlobalStates = () => useContext(WalletModalContext);
