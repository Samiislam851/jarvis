import ollama from 'ollama';

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
}

export interface ChatResponseMessage {
  role: ChatRole;
  content: string;
}

/** Non-streaming final object from POST /api/chat with stream: false */
export interface ChatResponse {
  model: string;
  created_at: string;
  message: ChatResponseMessage;
  done: boolean;
}

// const DEFAULT_BASE = "http://localhost:11434";
const model = "qwen2.5-coder:7b";
let messages: ChatMessage[] = [];
  const SYSTEM_PROMPT = `You are DemasoniFish, an expert coding assistant.
You help developers understand, navigate, and improve their codebases.
Be concise and precise. Prefer code examples over long explanations.`;

messages.push({ role: "system", content: SYSTEM_PROMPT });
 
export async function chat(
  content: string,
): Promise<string> {
  messages.push({ role: "user", content });
  const stream = await ollama.chat({
    model,
    messages : messages.slice(-20),
    stream: true,
  });
  let fullResponse = '';
  process.stdout.write('DemasoniFish: ');
  for await (const chunk of stream) {
    fullResponse += chunk.message.content;
    process.stdout.write(chunk.message.content);
  }
  process.stdout.write("\n"); // full line before readline redraws the next prompt
  messages.push({ role: "assistant", content: fullResponse });
  // console.log("\n\n\n"+ JSON.stringify(messages.slice(-5), null, 2) + "\n\n\n");
  
  console.log(fullResponse);
  return "";
}
