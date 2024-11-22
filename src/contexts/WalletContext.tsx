"use client";

import { WalletServiceInstance } from "@/resources/wallet/service/WalletService";
import React, { createContext, useContext, useState, useEffect } from "react";

interface WalletContextType {
  walletAddress: string | null;
  isAdmin: boolean;
  balance: string | null;
  balanceInUSD: string | null;
  priceChange: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceInUSD, setBalanceInUSD] = useState<string | null>(null);
  const [priceChange, setPriceChange] = useState<string | null>(null);

  useEffect(() => {
    const initWallet = async () => {
      const connectedWallet = WalletServiceInstance.getConnectedWallet();
      if (connectedWallet) {
        console.log("Initializing with connected wallet:", connectedWallet);
        await connectWallet();
      }

      if ((window as any).ethereum) {
        (window as any).ethereum.on("accountsChanged", handleAccountChange);
      }
    };

    initWallet();

    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeListener(
          "accountsChanged",
          handleAccountChange,
        );
      }
    };
  }, []);

  const handleAccountChange = async (accounts: string[]) => {
    console.log("Accounts changed:", accounts);

    if (!accounts || accounts.length === 0 || !accounts[0]) {
      console.warn("No valid accounts detected; disconnecting wallet.");
      disconnectWallet();
      return;
    }

    await connectWallet();
  };

  const connectWallet = async () => {
    try {
      const connectedAddress = await WalletServiceInstance.connectWallet();
      if (connectedAddress) {
        console.log("Wallet connected:", connectedAddress);
        setWalletAddress(connectedAddress);

        const adminStatus =
          await WalletServiceInstance.checkIfAdmin(connectedAddress);
        setIsAdmin(adminStatus);

        const { balance, balanceInUSD, priceChange } =
          await WalletServiceInstance.getAccountInfo();
        setBalance(balance);
        setBalanceInUSD(balanceInUSD);
        setPriceChange(priceChange);

        console.log("Account details updated after connection:", {
          adminStatus,
          balance,
          balanceInUSD,
          priceChange,
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = () => {
    try {
      WalletServiceInstance.disconnectWallet();
      console.log("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
    setWalletAddress(null);
    setIsAdmin(false);
    setBalance(null);
    setBalanceInUSD(null);
    setPriceChange(null);
  };

  useEffect(() => {
    const verifyWalletState = async () => {
      try {
        const connectedWallet = WalletServiceInstance.getConnectedWallet();
        if (connectedWallet && connectedWallet !== walletAddress) {
          console.log("Wallet state mismatch detected; updating...");
          await connectWallet();
        }
      } catch (error) {
        console.error("Error verifying wallet state:", error);
      }
    };

    const intervalId = setInterval(verifyWalletState, 5000);
    return () => clearInterval(intervalId);
  }, [walletAddress]);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isAdmin,
        balance,
        balanceInUSD,
        priceChange,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
