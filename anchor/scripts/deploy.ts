import { execSync } from "child_process";
import path from "path";

const cluster = process.argv[2] ?? "local";
const cwd = path.resolve(process.cwd());

const cmd = cluster === "devnet"
  ? "anchor deploy --provider.cluster devnet"
  : "anchor deploy";

console.log(`Deploying raffle program to ${cluster}...`);
execSync(cmd, {
  stdio: "inherit",
  cwd
});
