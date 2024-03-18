import { MessageArraySchema } from "@/lib/schemas/message.schema";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const parsedMessages = MessageArraySchema.parse(messages);

  const lastMessage = parsedMessages[parsedMessages.length - 1];

  // Enviar la solicitud POST a la URL deseada en el servidor local
  const url = "http://localhost:3000/chatbot"; // Reemplaza con la URL correcta
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lastMessage }), // Puedes enviar los datos en el cuerpo de la solicitud
  };

  const serverResponse = await fetch(url, requestOptions);
  const serverResponseText = await serverResponse.text();

  const llmResponse = new Response(serverResponseText, {
    headers: {
      "content-type": "text/plain",
    },
  });

  return llmResponse;
}
