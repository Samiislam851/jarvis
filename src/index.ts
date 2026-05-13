import readline from "node:readline";
// import { readline } from "node:readline";
import { chat } from "./ollama.js";


async function main(): Promise<void> {
  const rl = await readline.createInterface({ input: process.stdin, output: process.stdout });
  const firstMessage = "Jarvis: Hi I'm Jarvis, a coding assistant. How can I help you?";

  let fullResponse = "";
  
  for await (const char of firstMessage) {
    fullResponse += char;
    process.stdout.write(char);
  
    await new Promise((r) => setTimeout(r, 20)); // simulate streaming delay
  }
  
  process.stdout.write("\n\n");
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
