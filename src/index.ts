import readline from "node:readline";
// import { readline } from "node:readline";
import { chat } from "./ollama.js";


async function main(): Promise<void> {
  const rl = await readline.createInterface({ input: process.stdin, output: process.stdout });

  const ask = async () => {
    rl.question('You: ', async (input: string) => {
      if (input.trim() === "exit") {
        rl.close();
        return;
      }
      if (input.trim()) await chat(input.trim());
      ask(); // loop
    });
  };
  ask();
}

main().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
