import React, { createContext, useContext, useState } from "react";

const WalletProviderContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);

  return (
    <WalletProviderContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletProviderContext.Provider>
  );
};

export const useGlobalWallet = () => useContext(WalletProviderContext);
