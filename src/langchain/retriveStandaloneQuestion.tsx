import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { combineDocuments } from "./combineDocuments";

import retriever from "./retriever";

const openAIApiKey = process.env.OPENAI_API_KEY;

async function StandaloneQuestion() {
  const standaloneQuestionTemplate =
    "Given a question,  convert it to a standalone question. question: {question} standalone question :";

  const answerTemplate = `
    you are a customer service chat that are trying to help the user of out platform with their question  or requeriments.
     You should be friendly and only answer from the context provided and never make up answer.
     If you don't know the answer, apologise and advise the user to email help@email.com.
     always speak in a friendly and professional manner like talking to a friend.
     context: {context}
     question: {question}
     answer:
    `;

  const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

  const llm = new ChatOpenAI({ openAIApiKey, temperature: 0.2 });

  const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  const chain = standaloneQuestionPrompt
    .pipe(llm)
    .pipe(new StringOutputParser())
    .pipe(retriever)
    .pipe(combineDocuments);

  const response = await chain.invoke({
    question:
      "Where is my product? it's been almost a month since I ordered it. and I have not received it yet.",
  });

  console.log(response);

  return (
    <div>
      <h1>hello</h1>
    </div>
  );
}

export default StandaloneQuestion;
