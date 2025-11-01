import { spawn } from "child_process";

const processes = [
  {
    name: "validator",
    command: "solana-test-validator",
    args: ["--reset"],
    ready: /ledger ready/
  },
  {
    name: "anchor-test",
    command: "pnpm",
    args: ["--filter", "anchor", "test", "--", "--skip-build"],
    ready: /1 passing|All tests/
  },
  {
    name: "web",
    command: "pnpm",
    args: ["--filter", "apps/web", "dev"],
    ready: /Local:   http/ 
  }
];

processes.forEach(({ name, command, args }) => {
  const child = spawn(command, args, { stdio: "inherit", shell: true });
  child.on("exit", (code) => {
    console.log(`${name} exited with code ${code}`);
  });
});
