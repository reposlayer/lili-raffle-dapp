import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const anchorTypesPath = path.resolve(__dirname, "../../anchor/target/types/lili_raffle_program.ts");
const outputDir = path.resolve(__dirname, "generated");

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const fallback = "export type LiliRaffleProgram = Record<string, unknown>;\nexport const IDL: LiliRaffleProgram = {};\n";

  const types = await fs
    .readFile(anchorTypesPath, "utf8")
    .catch(() => fallback);

  await fs.writeFile(path.join(outputDir, "lili_raffle_program.ts"), types, "utf8");
  await fs.writeFile(path.join(outputDir, "index.ts"), "export * from './lili_raffle_program';\n", "utf8");

  console.log("SDK generated at", outputDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
