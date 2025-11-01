import * as anchor from "@coral-xyz/anchor";
import { expect } from "chai";
import { Buffer } from "buffer";
import { LiliRaffleProgram } from "../target/types/lili_raffle_program";

const RAFFLE_SEED = Buffer.from("raffle");

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const program = anchor.workspace.LiliRaffleProgram as anchor.Program<LiliRaffleProgram>;

describe("lili raffle program", () => {
  it("creates a raffle", async () => {
    const authority = provider.wallet.publicKey;
    const [raffle] = anchor.web3.PublicKey.findProgramAddressSync(
      [RAFFLE_SEED, authority.toBuffer()],
      program.programId
    );

    await program.methods
      .initialize({
        priceLamports: new anchor.BN(10000000),
        maxTickets: 100,
        endTimestamp: new anchor.BN(Math.floor(Date.now() / 1000) + 3600)
      })
      .accounts({
        raffle,
        authority,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc();

    const account = await program.account.raffle.fetch(raffle);
    expect(account.authority.toBase58()).to.equal(authority.toBase58());
    expect(account.maxTickets).to.equal(100);
  });
});
