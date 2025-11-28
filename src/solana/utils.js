import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

const NETWORK = "https://api.devnet.solana.com";

export async function lockFunds(wallet, escrowAddress, amountSol) {
  try {
    if (!wallet?.publicKey) throw new Error("Wallet not connected");
    if (!escrowAddress) throw new Error("Escrow address missing");

    amountSol = parseFloat(amountSol);
    if (isNaN(amountSol) || amountSol <= 0) throw new Error("Invalid SOL amount");

    const connection = new Connection(NETWORK, "confirmed");
    const escrowPubKey = new PublicKey(escrowAddress);

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: escrowPubKey,
        lamports: Math.floor(amountSol * 1e9),
      })
    );

    const signature = await wallet.sendTransaction(tx, connection);
    await connection.confirmTransaction(signature, "confirmed");

    console.log("Funds Locked | Tx Signature:", signature);
    return signature;

  } catch (err) {
    console.error("Failed to lock funds:", err.message);
    throw new Error("Failed to lock funds: " + err.message);
  }
}

export async function releaseFunds(wallet, sellerAddress, amountSol) {
  try {
    if (!wallet?.publicKey) throw new Error("Wallet not connected");
    if (!sellerAddress) throw new Error("Seller address missing");

    amountSol = parseFloat(amountSol);
    if (isNaN(amountSol) || amountSol <= 0) throw new Error("Invalid SOL amount");

    const connection = new Connection(NETWORK, "confirmed");
    const sellerPubKey = new PublicKey(sellerAddress);

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: sellerPubKey,
        lamports: Math.floor(amountSol * 1e9),
      })
    );

    const signature = await wallet.sendTransaction(tx, connection);
    await connection.confirmTransaction(signature, "confirmed");

    console.log("Funds Released | Tx Signature:", signature);
    return signature;

  } catch (err) {
    console.error("Failed to release funds:", err.message);
    throw new Error("Failed to release funds: " + err.message);
  }
}