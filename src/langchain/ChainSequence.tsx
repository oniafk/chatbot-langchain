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

interface ChainSequenceProps {
  questionInput: string;
}

async function ChainSequence({ questionInput }: ChainSequenceProps) {
  const standaloneQuestionTemplate = `Given a question,  convert it to a standalone question. question: {question} standalone question :`;

  const SQPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);

  const answerTemplate = `
    you are a customer service chat that are trying to help the user of out platform with their question or requeriments.
    as soon you understand the question from the customer, process the context provided.
     You should be friendly and only answer from the context provided and never make up answer.
     if you need to ask for more information, ask the user in a friendly manner.
     if you realize that the customer is trying to be friendly and greets you, always greet back. if tghe customer is just trying to be formal and ask for help, always be formal and help the customer asking what do they need,  for example.
     You have to try to respond to a normal conversation that hasn't yet entered the business logic, only when you see questions that are related to the business according to the context we have provided can you use that information to answer the question.
     If you don't know the answer, apologise and advise the user to email help@email.com, use this also when you have questions related to accounts, like changing passwords or questions related to personal info from the customer.
     always speak in a friendly and professional manner like talking to a friend.
     give a short and concise answer to the customer where this you think is the answer where the action that the customer is going to execute has the least effort it can be done.
     just explain the process to solve the customers problem, you dont need to disclose or explain the company policies.
     also remember that the customer just wants to know the solution to their problem, so be concise and to the point try to make the answer as short as possible, 
     and get into the details just if the customer ask for them, this means, if you can give a short answer that uses less than 30 words to the customer is ok; 
     remember, just give the information that the customer needs to solve their problem. 
     remember that you are the customer assistant, always ask for more info if  you need it and just if you dont have information on the context provided, reffer to the customer to the email provided.
     if you dont receive any context for the question, probbably this means that this questions does not concern to your role, so, appologize with the customer that you cant give an answer to its question and reffer to the customer to the email provided.  
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
    question: questionInput,
  });

  console.log(response);

  return (
    <div>
      <h1>Customer Service Answer</h1>
    </div>
  );
}

export default ChainSequence;
