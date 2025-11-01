import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useMemo, useState } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { useRaffle } from "./hooks/useRaffle";

import "@solana/wallet-adapter-react-ui/styles.css";

const rpcEndpoint = import.meta.env.VITE_SOLANA_RPC ?? clusterApiUrl("devnet");

export default function App() {
  const endpoint = useMemo(() => rpcEndpoint, []);
  const { raffleState, purchaseTicket } = useRaffle();
  const [status, setStatus] = useState<string | null>(null);
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <main className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
              <header className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-semibold">Raffle Drop</h1>
                  <p className="text-slate-400">Anchor powered, TypeScript orchestrated.</p>
                </div>
                <WalletMultiButton className="rounded bg-indigo-500 px-4 py-2 text-sm font-medium shadow transition hover:bg-indigo-600" />
              </header>

              <section className="rounded-lg border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold text-white">Raffle configuration</h2>
                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-slate-400">Price (SOL)</dt>
                    <dd className="text-white">{raffleState.price}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Tickets sold</dt>
                    <dd className="text-white">{raffleState.ticketsSold}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Max tickets</dt>
                    <dd className="text-white">{raffleState.maxTickets}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Ends</dt>
                    <dd className="text-white">{raffleState.ends}</dd>
                  </div>
                </dl>

                <button
                  className="mt-6 w-full rounded bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-indigo-600"
                  onClick={async () => {
                    setStatus("Submitting transaction...");
                    try {
                      await purchaseTicket();
                      setStatus("Ticket purchased!");
                    } catch (error: unknown) {
                      setStatus(error instanceof Error ? error.message : String(error));
                    }
                  }}
                >
                  Buy ticket
                </button>
                {status && <p className="mt-3 text-xs text-slate-400">{status}</p>}
              </section>
            </div>
          </main>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
