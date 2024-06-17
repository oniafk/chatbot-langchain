import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import { BaseLanguageModel } from "langchain/base_language";

const llm = new ChatOpenAI({
  modelName: "gpt-4o",
});

let currentHistoryChat: [string, string][] = [
  ["", "Hello, I'm here to help you with your order."],
];

type ConversationalRetrievalQAChainInput = {
  question: string;
  chat_history: [string, string][];
};

async function loadChatChain(llm: BaseLanguageModel, verbose: boolean = false) {
  const prompt = new PromptTemplate({
    template: `
    You are a customer service representative for a e-comerce company.
    you are designed for giving a solution to our customers providing the best possible service. the first approach will be ask for customers name, issue that they are facing, and order number, 
    on our policies that will be provided on the context next to this, you will find the best way to help the customer and possible solutions aviable. 
    You also will have personal information that is just for verification purposes, this is ahead in the context.
    if you dont have a solution aviable, ask them to send an email to
    customerService@email.com

    use todays date to provide the best possible service and apply the policies that you need.

    {date}
    
    please, always answer in the same language that the customer talks to you
    
    Example1:
    
    Client: Hello, I have a problem with my package, it didnt arrive yet.
    Assistant: Hello, I'm sorry to hear that, could you provide me with your order Number and can you tell me your name?
    client: sure, My name is Manuel and the order number is 1
    Assistant: thank you, According with the information on the system, Manuel, it looks like your order has been delivered, Manuel, I understand that it has been more than 48 since the delivery date,
    according with the policy we can offer you a refund or a replacement, what would you prefer?
    client: I would like to get a replacement.
    assistant: I will process that for you, Manuel, you will receive an email with the confirmation. Let me tell you that the new package will be shipped in 24 hours. Do you need anything else Manuel?
    client: No, thank you.
    
    Example2:
    
    client: Hello, I have a problem with my package, it didnt arrive yet.
    Assistant: Hello, I'm sorry to hear that, please, can you tell me your name and could you provide me with your order Number?
    client: My name is Daniel and the order number is 4
    Assistant: thank you Daniel, According with our informations, I just can say that the package has been lost in transit, I know that this is frustrating for you Daniel... we can offer you to replace the order or a refund, what would you prefer?
    Client: I would like a refund, please.
    Assistant: I will process that for you, Daniel , you will receive an email with the confirmation. Let me tell you that the money will show up in your account in 3-5 business days. Do you need anything else Daniel?
    Client: Thank you. thants it.
    
    example3:
    client: Hello, I have a problem with my package, it didnt arrive yet.
    Assistant: Hello, I'm sorry to hear that, please, can you tell me your name and could you provide me with your order Number?
    client: My name is Oscar and my order number is 2
    Assistant: thank you Oscar, According to the information on our system, it appears that your order has been marked as delivered. Could you please check the following: 1. Verify if the shipping address in "Your Orders" is correct. 2. Look for a notice of a delivery attempt in your mailbox or delivery location. 3. Check your mailbox or wherever else you receive mail. 4. Check around the delivery location; the package could have been left in a different spot or where you requested in your delivery instructions. 5. Ask your household members or neighbors if they might have accepted the delivery on your behalf. If you still cannot locate your package after taking these steps, please wait 48 hours, as packages may be mistakenly scanned as delivered up to 48 hours before arrival. If the package has not arrived after this period, please reach out again, and we will assist you further. Is there anything else I can help you with?
    client: I will do that, thank you.
    Assistant: You're welcome, Oscar. If you have any other questions or need further assistance, please don't hesitate to reach out. Have a great day!

    chat History:
    {chat_history}
    
    context that has customer information and policies:
    {context}
    
    your answer in english:
    `,
    inputVariables: ["chat_history", "context", "date"],
  });
  return new LLMChain({ llm, prompt, verbose });
}

export async function customerAssistantResponse(humanMessage: string) {
  const date = new Date().toLocaleDateString();

  currentHistoryChat.push([humanMessage, ""]);
  let answer;
  const formatChatHistory = (chat: [string, string][]) => {
    const formattedDialogueTurns = chat.map(
      (dialogueTurn) =>
        `Human: ${dialogueTurn[0]}\nAssistant: ${dialogueTurn[1]}`
    );
    return formattedDialogueTurns.join("\n");
  };

  const retrieveDocuments = async (humanMessage: string) => {
    const urlDocuments =
      "https://chatbot-langchain-backend.onrender.com/chatbot/getRelevantDocuments";
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

    const userUrl =
      "https://chatbot-langchain-backend.onrender.com/all-order-info";
    const requestOptionsUserInfo = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const [serverResponseUserInfo, serverResponse] = await Promise.all([
      fetch(userUrl, requestOptionsUserInfo),
      fetch(urlDocuments, requestOptionsDocuments),
    ]);

    const serverResponseTextUserInfo = await serverResponseUserInfo.text();
    const userInfo = JSON.stringify(serverResponseTextUserInfo);

    const serverResponseText = await serverResponse.text();
    const retrieverDocuments = JSON.parse(serverResponseText);

    const retriever = `context:${retrieverDocuments}  /n User Information from DataBase:${userInfo}`;

    return retriever;
  };

  const contextAnswer = await retrieveDocuments(humanMessage);
  const formatedChat = formatChatHistory(currentHistoryChat);

  const verbose = true;

  const chatChain = await loadChatChain(llm, verbose);

  if (contextAnswer && formatedChat) {
    answer = await chatChain.invoke({
      chat_history: formatedChat,
      context: contextAnswer,
      date: date,
    });
  }

  if (answer) {
    const { text } = answer;
    currentHistoryChat[currentHistoryChat.length - 1][1] = text;
    console.log(currentHistoryChat, "currentHistoryChat");
    return text;
  } else {
    return "I'm sorry, I couldn't find a solution for your problem, please send an email to help@email.com";
  }
}
