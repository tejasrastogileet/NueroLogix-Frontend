import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ShipmentDetails from "./ShipmentDetails";
import AddShipment from "./AddShipment";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

export default function App() {
  const endpoint = clusterApiUrl("devnet");
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/shipment/:id" element={<ShipmentDetails />} />
              <Route path="/add-shipment" element={<AddShipment />} />
            </Routes>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
