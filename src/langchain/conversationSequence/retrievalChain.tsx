import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { format } from "path";

const llm = new ChatOpenAI({
  modelName: "gpt-4o",
});

const answerTemplate = `
You are a customer service representative for a e-comerce company.
you are designed for giving a solution to our customers providing the best possible service. the first approach will be ask for customers name, issue that they are facing, and order number, 
on our policies that will be provided on the context next to this, you will find the best way to help the customer and possible solutions aviable. 
You also will have personal information that is just for verification purposes, this is ahead in the context.
if you dont have a solution aviable, ask them to send an email to
customerService@email.com

please, always answer in the same language that the customer talks to you

Example1:

Client: Hello, I have a problem with my package, it didnt arrive yet.
Assistant: Hello, I'm sorry to hear that, could you provide me with your order Number and can you tell me your name?
client: sure, My name is Manuel and the order number is 1
Assistant: thank you, According with the information on the system, Manuel, it looks like your order has been delivered, Manuel, could you please check with your neighbors or family members if they received it?
client: I will do that, thank you.

Example2:

client: Hello, I have a problem with my package, it didnt arrive yet.
Assistant: Hello, I'm sorry to hear that, please, can you tell me your name and could you provide me with your order Number?
client: My name is Daniel and the order number is 4
Assistant: thank you Daniel, According with our informations, I just can say that the package has been lost in transit, I know that this is frustrating for you Daniel... we can offer you to replace the order or a refund, what would you prefer?
Client: I would like a refund, please.
Assistant: I will process that for you, Daniel , you will receive an email with the confirmation. Let me tell you that the money will show up in your account in 3-5 business days. Do you need anything else Daniel?
Client: Thank you. thants it.

chat History:
{chat_history}

context that has customer information and policies:
{context}

your answer:
`;
const ANSWER_PROMPT = PromptTemplate.fromTemplate(answerTemplate);

let currentHistoryChat: [string, string][] = [
  ["", "Hello, I'm here to help you with your order."],
];

type ConversationalRetrievalQAChainInput = {
  question: string;
  chat_history: [string, string][];
};

export async function customerAssistantResponse(humanMessage: string) {
  const formatChatHistory = (chat: [string, string][]) => {
    const formattedDialogueTurns = chat.map(
      (dialogueTurn) =>
        `Human: ${dialogueTurn[0]}\nAssistant: ${dialogueTurn[1]}`
    );
    return formattedDialogueTurns.join("\n");
  };

  const retrieverDocuments = async (humanMessage: string) => {
    const urlDocuments = "http://localhost:3001/chatbot";
    const requestOptionsDocuments = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        humanMessage,
        chatHistory: formatChatHistory(currentHistoryChat),
      }),
    };

    const userUrl = "http://localhost:3001/all-order-info";
    const requestOptionsUserInfo = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const serverResponseUserInfo = await fetch(userUrl, requestOptionsUserInfo);
    const serverResponseTextUserInfo = await serverResponseUserInfo.text();
    const userInfo = JSON.stringify(serverResponseTextUserInfo);

    const serverResponse = await fetch(urlDocuments, requestOptionsDocuments);
    const serverResponseText = await serverResponse.text();
    const retrieverDocuments = JSON.parse(serverResponseText);

    const retriever = `context:${retrieverDocuments}  /n User Information from DataBase:${userInfo}`;

    return retriever;
  };

  const answerChain = RunnableSequence.from([
    {
      question: (input: ConversationalRetrievalQAChainInput) => input.question,
      chat_history: (input: ConversationalRetrievalQAChainInput) =>
        formatChatHistory(input.chat_history),
    },
    (prevResult) => console.log(prevResult, "prevResult"),
    ANSWER_PROMPT,
    llm,
    new StringOutputParser(),
  ]);

  const result1 = await answerChain.invoke({
    question: humanMessage,
    chat_history: currentHistoryChat,
  });

  console.log(result1, "result1");

  currentHistoryChat.push([humanMessage, result1]);

  const response = result1;

  return response;
}
