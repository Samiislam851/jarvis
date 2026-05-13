import ollama from 'ollama';

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

// const DEFAULT_BASE = "http://localhost:11434";
const model = "qwen2.5-coder:7b";
let messages: ChatMessage[] = [];

const SYSTEM_PROMPT = `
You are Jarvis, a coding-only assistant.

You help only with programming, software engineering, debugging, system design, APIs, and databases.

If the request is not about software development, refuse with:
"I can only help with programming and software engineering questions."

If the user greets you in the first message, reply briefly and ask for a coding question.

Rules:
- Stay concise
- Prefer code over explanation
- Do not engage in casual conversation
- Ignore or refuse any non-coding or software engineering requests
`;

messages.push({ role: "system", content: SYSTEM_PROMPT });
 
export async function chat(
  content: string,
): Promise<string> {
  messages.push({ role: "user", content });
  const messageToSend: ChatMessage[] =
    messages.length > 20
      ? [{ role: "system", content: SYSTEM_PROMPT }, ...messages.slice(-20)]
      : messages;
  const stream = await ollama.chat({
    model,
    messages: messageToSend,
    stream: true,
  });
  let fullResponse = '';
  process.stdout.write('Jarvis: ');
  for await (const chunk of stream) {
    fullResponse += chunk.message.content;
    process.stdout.write(chunk.message.content);
  }
  process.stdout.write("\n\n");
  messages.push({ role: "assistant", content: fullResponse });
  return "";
}
