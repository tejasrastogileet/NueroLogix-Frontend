import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

export const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
export const PROGRAM_ID = new PublicKey("F8S489P7mZNASA2vWna3wEyE5eK2wdVS9XAqDBbSFH5S");
