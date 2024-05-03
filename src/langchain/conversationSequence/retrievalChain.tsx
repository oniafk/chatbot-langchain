import { ChatOpenAI } from "@langchain/openai";
import { EntityMemory } from "langchain/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import { ConversationChain } from "langchain/chains";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
});

const memory = new EntityMemory({
  llm: new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
  }),
  chatHistoryKey: "history",
  entitiesKey: "entities",
});

const customerAssistancePrompt = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(
  customerAssistancePrompt
);

const answerTemplate = `
You are a customer service representative for a e comerce company.
Answer the question based only on the following context:
{context}

the answer will be based on 4 steps:

1. check the documents related to the conversation scenarios for examples given to reply the customer,
    this is a example of the conversation that you will have and it will be used as guide for replying the customer message.

    2. check the documents for Customer service policies, this documents provide the rules that you need to follow when replying the customer message.
    it will contain the rules of the company and posibles solutions for customer issues.

    3. check the documents for Customer service behavior, this documents provide a guide for the best way to reply the customer message.
    it will contain the best way to reply the customer message and also it will show the way that you will behave to face the different scenarios that you will have on
    each interaction with the customers.

    4. check the documents for the NOs scenarios, this documents provide the scenarios that you need to avoid when replying the customer message.
    this documents will show the things that you must avoid at the momment of replying the customer message.

    always remember that this documents are a guide for you to give the best answer to the customer, if you dont have the information that you need to reply the customer message
    refeer the customer to get in contact with us to the email: contactus@email.com

    the name of the customer is "Manuel" and also, you can check the history of his orders attched to the context
     
Question: {question}

your answer:
`;
const ANSWER_PROMPT = PromptTemplate.fromTemplate(answerTemplate);

const formatChatHistory = (chatHistory: [string, string][]) => {
  const formattedDialogueTurns = chatHistory.map(
    (dialogueTurn) => `Human: ${dialogueTurn[0]}\nAssistant: ${dialogueTurn[1]}`
  );
  return formattedDialogueTurns.join("\n");
};

type ConversationalRetrievalQAChainInput = {
  question: string;
  chat_history: [string, string][];
};

export async function customerAssistantResponse(humanMessage: string) {
  const retrieveDocuments = async (humanMessage: string) => {
    const url = "https://chatbot-langchain-backend.onrender.com/chatbot";

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ humanMessage }),
    };

    const serverResponse = await fetch(url, requestOptions);
    const serverResponseText = await serverResponse.text();
    console.log(serverResponseText); // Imprimir la respuesta del servidor
    const retrieverDocuments = JSON.parse(serverResponseText);

    const retriever = retrieverDocuments;

    return retriever;
  };

  const standaloneQuestionChain = RunnableSequence.from([
    {
      question: (input: ConversationalRetrievalQAChainInput) => input.question,
      chat_history: (input: ConversationalRetrievalQAChainInput) =>
        formatChatHistory(input.chat_history),
    },
    CONDENSE_QUESTION_PROMPT,
    llm,
    new StringOutputParser(),
  ]);

  const answerChain = RunnableSequence.from([
    {
      context: retrieveDocuments,
      question: new RunnablePassthrough(),
    },
    ANSWER_PROMPT,
    llm,
    new StringOutputParser(),
  ]);

  const conversationalRetrievalQAChain =
    standaloneQuestionChain.pipe(answerChain);

  const result1 = await conversationalRetrievalQAChain.invoke({
    question: humanMessage,
    chat_history: [],
  });

  console.log(result1);

  const response = result1;

  return response;
}
