"use client";

import { WalletServiceInstance } from "@/resources/wallet/service/WalletService";
import React, { createContext, useContext, useState, useEffect } from "react";

interface WalletContextType {
  walletAddress: string | null;
  isAdmin: boolean;
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

  useEffect(() => {
    const connectedWallet = WalletServiceInstance.getConnectedWallet();
    if (connectedWallet) {
      setWalletAddress(connectedWallet);
      checkIfAdmin(connectedWallet);
    }
  }, []);

  const checkIfAdmin = async (account: string) => {
    const adminStatus = await WalletServiceInstance.checkIfAdmin(account);
    setIsAdmin(adminStatus);
  };

  const connectWallet = async () => {
    const connectedAddress = await WalletServiceInstance.connectWallet();
    if (connectedAddress) {
      setWalletAddress(connectedAddress);
      checkIfAdmin(connectedAddress);
    }
  };

  const disconnectWallet = () => {
    WalletServiceInstance.disconnectWallet();
    setWalletAddress(null);
    setIsAdmin(false);
  };

  return (
    <WalletContext.Provider
      value={{ walletAddress, isAdmin, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};
