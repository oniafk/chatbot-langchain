import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { combineDocuments } from "./combineDocuments";

import retriever from "./retriever";

const openAIApiKey = process.env.OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });

async function CustomerServiceAnswer() {
  const standaloneQuestionTemplate = `Given a question,  convert it to a standalone question. question: {question} standalone question :`;

  const SQPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);

  const answerTemplate = `
    you are a customer service chat that are trying to help the user of out platform with their question or requeriments.
    as soon you understand the question from the customer, process the context provided.
     You should be friendly and only answer from the context provided and never make up answer.
     if you need to ask for more information, ask the user in a friendly manner.
     If you don't know the answer, apologise and advise the user to email help@email.com.
     always speak in a friendly and professional manner like talking to a friend.     
     this is the question of your customer: {question}
     and this is the context provided: {context} for given a solution to the customer.
     answer:
    `;

  const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

  const contextTemplate = ` given the next context {context} process the information and keep the key parts about it`;

  const contextPrompt = PromptTemplate.fromTemplate(contextTemplate);

  const standaloneQuestionChain = RunnableSequence.from([
    SQPrompt,
    llm,
    new StringOutputParser(),
    retriever,
    combineDocuments,
  ]);

  const contextChain = RunnableSequence.from([
    contextPrompt,
    llm,
    new StringOutputParser(),
  ]);

  const customerServiceAnswerChain = RunnableSequence.from([
    answerPrompt,
    llm,
    new StringOutputParser(),
  ]);

  const chain = RunnableSequence.from([
    {
      context: standaloneQuestionChain,
      originalQuestion: new RunnablePassthrough(),
    },
    {
      context: contextChain,
      question: ({ originalQuestion }) => originalQuestion.question,
    },
    {
      answer: customerServiceAnswerChain,
    },
  ]);

  const response = await chain.invoke({
    question: "How can I return an item that is damaged?",
  });

  console.log(response);

  return (
    <div>
      <h1>Customer Service Answer</h1>
    </div>
  );
}

export default CustomerServiceAnswer;
