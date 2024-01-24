import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import getSplittedText from "../langchain/textSplitter";

const supabaseApiKey = process.env.SUPABASE_API_KEY;
const supabaseURL = process.env.SUPABASE_URL;
const openaiApiKey = process.env.OPENAI_API_KEY;

const text = async () => {
  const splittedText = await getSplittedText();
  return splittedText || [];
};

const creatingVectorStore = async () => {
  const supabaseClient = createClient(supabaseURL!, supabaseApiKey!);

  const textData = await text();

  if (textData) {
    await SupabaseVectorStore.fromDocuments(
      textData,
      new OpenAIEmbeddings({ openAIApiKey: openaiApiKey }),
      {
        client: supabaseClient,
        tableName: "documents",
      }
    );
  }
};

export default creatingVectorStore;
