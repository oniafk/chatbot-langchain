import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import loadText from "./textLoader";
import { Document } from "langchain/document";

const supabaseApiKey = process.env.SUPABASE_API_KEY;
const supabaseURL = process.env.SUPABASE_URL;
const openaiApiKey = process.env.OPENAI_API_KEY;

const getSplittedText = async () => {
  try {
    const { text } = await loadText();
    const result = text[0].pageContent;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
      separators: [" ", "\n"],
    });

    const docOutput = await splitter.splitDocuments([
      new Document({ pageContent: result }),
    ]);

    return docOutput;
  } catch (error) {
    console.log(error);
  }
};

export default function textSplitted() {
  console.log(getSplittedText());
}
