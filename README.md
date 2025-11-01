# Raffle dApp Starter

Full-stack Solana raffle template with an Anchor program, TypeScript SDK generator, and Vite + React front-end. Use this to launch on-chain raffles with configurable entry price, max tickets, and reveal windows.

## Stack

- Anchor 0.29 program with PDA-based raffle vaults
- TypeScript mocha tests and deploy script
- pnpm workspaces with shared ESLint + TS config
- Vite React front-end with wallet adapter + TanStack Query
- Shared SDK package you can publish for consumers

## Quickstart

```bash
pnpm install
pnpm --filter anchor build
pnpm --filter anchor test
pnpm --filter @lili/raffle-sdk build
pnpm dev
```

Edit the raffle parameters inside `anchor/programs/lili_raffle_program/src/lib.rs` and ship the front-end UI in `apps/web/src`.

## Environment

Copy `.env.example` at the project root to `.env` and fill in:

```env
ANCHOR_WALLET=~/.config/solana/id.json
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com
VITE_SOLANA_RPC=https://api.devnet.solana.com
VITE_RAFFLE_PROGRAM_ID=ReplaceWithProgramId
```