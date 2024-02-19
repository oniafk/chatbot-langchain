import ChainSequence from "@/langchain/ChainSequence";
import { MessageArraySchema } from "@/lib/schemas/message.schema";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const parsedMessages = MessageArraySchema.parse(messages);

  const lastMessage = parsedMessages[parsedMessages.length - 1];

  const response = await ChainSequence({ questionInput: lastMessage.text });

  return new Response(JSON.stringify(response), {
    headers: {
      "content-type": "application/json",
    },
  });
}
