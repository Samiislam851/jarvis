import { chat } from "./ollama.js";

async function main(): Promise<void> {
  const result = await chat({
    model: "qwen2.5-coder:7b",
    messages: [{ role: "user", content: "Hello are you on?" }],
    stream: false,
  });

  console.log(result.message.content);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
