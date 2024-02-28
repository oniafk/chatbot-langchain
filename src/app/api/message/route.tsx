import ChainSequence from "@/langchain/ChainSequence";
import { MessageArraySchema } from "@/lib/schemas/message.schema";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const parsedMessages = MessageArraySchema.parse(messages);

  const lastMessage = parsedMessages[parsedMessages.length - 1];

  const response = await ChainSequence({ questionInput: lastMessage.text });
  console.log(response);

  let formattedResponse = response.replace(/"/g, "");

  console.log(messages);
  return new Response(formattedResponse, {
    headers: {
      "content-type": "text/plain",
    },
  });
}
