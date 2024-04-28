import { MessageArraySchema } from "@/lib/schemas/message.schema";
import { customerAssistantResponse } from "@/langchain/conversationSequence/retrievalChain";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const parsedMessages = MessageArraySchema.parse(messages);

  const lastMessage = parsedMessages[parsedMessages.length - 1];

  const serverResponseText = await customerAssistantResponse(lastMessage.text); // Reemplaza con serverResponse.text(

  const llmResponse = new Response(serverResponseText, {
    headers: {
      "content-type": "text/plain",
    },
  });

  return llmResponse;
}
