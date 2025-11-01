import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Buffer } from "buffer";
import { useCallback, useMemo, useState } from "react";

const PROGRAM_ID = new PublicKey(import.meta.env.VITE_RAFFLE_PROGRAM_ID ?? "RaFfle111111111111111111111111111111111111");
const RAFFLE_PDA_SEED = "raffle";

export function useRaffle() {
  const wallet = useWallet();
  const [lastPurchaseSignature, setLastPurchaseSignature] = useState<string | null>(null);

  const connection = useMemo(() => {
    const rpc = import.meta.env.VITE_SOLANA_RPC ?? "https://api.devnet.solana.com";
    return new Connection(rpc, "confirmed");
  }, []);

  const raffleState = {
    price: 0.1,
    ticketsSold: 0,
    maxTickets: 100,
    ends: new Date(Date.now() + 60 * 60 * 1000).toLocaleString(),
    lastPurchaseSignature
  };

  const purchaseTicket = useCallback(async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Connect a wallet that supports signTransaction");
    }

    const [rafflePda] = PublicKey.findProgramAddressSync(
      [Buffer.from(RAFFLE_PDA_SEED), wallet.publicKey.toBuffer()],
      PROGRAM_ID
    );

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: rafflePda,
        lamports: 100000000
      })
    );

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const signed = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    setLastPurchaseSignature(signature);
    await connection.confirmTransaction(signature, "confirmed");
  }, [wallet, connection]);

  return {
    raffleState,
    purchaseTicket
  };
}
