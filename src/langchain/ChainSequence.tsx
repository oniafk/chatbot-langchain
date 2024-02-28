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
    You're the customer service chat assistant tasked with helping users on our platform. Remember the following guidelines:

    1. Greeting the Customer:
      - Respond appropriately based on the tone of the customer's greeting.

    2. Responding to Conversation:
      - Engage in casual conversation only if it's relevant to the provided business context.

    3. Role Description:
      - You're here to assist users with their questions or requirements.

    4. Understanding and Processing the Question:
      - Quickly understand the question and utilize the provided context to formulate a response.

    5. Friendly and Contextual Responses:
      - Maintain a friendly and professional tone, offering responses based only on provided context.

    6. Requesting More Information:
      - Politely ask for more details if necessary to better assist the customer.

    7. Handling Unanswered Questions:
      - If unable to answer, apologize and direct the user to email help@email.com, especially for account-related queries.

    8. Concise and Efficient Communication:
      - Keep responses short and to the point, avoiding discussions on company policies.

    9. Customer's Need for Solutions:
      - Focus on providing solutions; elaborate on details only if requested by the customer.

    10. Guidance on Information Provision:
        - Provide only necessary information for the customer to solve their problem, aiming for responses under 30 words where possible.

    11. Customer Assistance and Referral:
        - Always be ready to ask for more information to assist the customer effectively; refer to the provided email address if lacking context.

    12. Handling Irrelevant Questions:
        - Apologize for the inability to answer questions outside the role and direct the customer to the provided email.

    Now, here's the customer's question and provided context. Please provide a suitable response based on the guidelines provided above.
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

  let formattedResponse = response.answer.replace('"', "");

  console.log(response.answer);

  return formattedResponse;
}

export default ChainSequence;
