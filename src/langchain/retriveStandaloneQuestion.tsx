import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "langchain/prompts";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";

const openAIApiKey = process.env.OPENAI_API_KEY;

const embeddings = new OpenAIEmbeddings({ openAIApiKey });
const supabaseApiKey = process.env.SUPABASE_API_KEY;
const supabaseURL = process.env.SUPABASE_URL;
const client = createClient(supabaseURL!, supabaseApiKey!);

// const vectorStore = new SupabaseVectorStore(embeddings, {
//   client,
//   tableName: "documents", //table that contains the vectors that we want to search and match information from
//   queryName: "match_documents", //query that we want to use to search the table, this is on supabase and can be edited
// });

// const retriever = vectorStore.asRetriever(); // this is the retriever that we will use to search the table that is defined on the vectorStore const

// const llm = new ChatOpenAI({ openAIApiKey });

// const standaloneQuestion =
//   "Given a question,  convert it to a standalone question. question: {question} standalone question :";

// const standaloneQuestionPrompt =
//   PromptTemplate.fromTemplate(standaloneQuestion);
// const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm);

// const response = await standaloneQuestionChain.invoke({
//   question:
//     "Where is my product? it's been almost a month since I ordered it. and I have not received it yet.",
// });

// const response2 = await retriever.invoke("when will my product arrive?");

// console.log(response);
// console.log(response2);

async function StandaloneQuestion() {
  const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: "documents", //table that contains the vectors that we want to search and match information from
    queryName: "match_documents", //query that we want to use to search the table, this is on supabase and can be edited
  });

  const retriever = vectorStore.asRetriever(); // this is the retriever that we will use to search the table that is defined on the vectorStore const

  const llm = new ChatOpenAI({ openAIApiKey });

  const standaloneQuestion =
    "Given a question,  convert it to a standalone question. question: {question} standalone question :";

  const standaloneQuestionPrompt =
    PromptTemplate.fromTemplate(standaloneQuestion);
  const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm);

  const response = await standaloneQuestionChain.invoke({
    question:
      "Where is my product? it's been almost a month since I ordered it. and I have not received it yet.",
  });

  const response2 = await retriever.invoke("when will my product arrive?");

  console.log(response);
  console.log(response2);
  return (
    <div>
      <h1>hello</h1>
    </div>
  );
}

export default StandaloneQuestion;
