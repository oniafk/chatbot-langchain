import { MessageArraySchema } from "@/lib/schemas/message.schema";
import { customerAssistantResponse } from "@/langchain/conversationSequence/retrievalChain2";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const parsedMessages = MessageArraySchema.parse(messages);

  const lastMessage = parsedMessages[parsedMessages.length - 1];

  const serverResponseText = await customerAssistantResponse(lastMessage.text);

  const llmResponse = new Response(serverResponseText, {
    headers: {
      "content-type": "text/plain",
    },
  });

  return llmResponse;
}
