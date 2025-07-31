import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages, selectedText } = await req.json();

  const result = streamText({
    model: openai("gpt-4.1"),
    messages: [
      {
        role: "system",
        content: `You are a helpful writing assistant. The user has selected the following text from their document: "${selectedText}". Please provide helpful feedback, suggestions, or answer questions about this selected text. Keep your responses concise and focused on the selected content.`,
      },
      ...messages,
    ],
  });

  return result.toDataStreamResponse();
}
