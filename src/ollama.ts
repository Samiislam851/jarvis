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

const DEFAULT_BASE = "http://localhost:11434";

export async function chat(
  body: ChatRequest,
  baseUrl: string = DEFAULT_BASE
): Promise<ChatResponse> {
  const url = new URL("/api/chat", baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama chat failed ${res.status}: ${text}`);
  }

  return (await res.json()) as ChatResponse;
}
