import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import loadText from "./textLoader";

const getSplittedText = async () => {
  try {
    const { text } = await loadText();
    const result = text[0].pageContent;

    const splitter = new RecursiveCharacterTextSplitter();

    const docOutput = await splitter.createDocuments([result]);
    console.log(docOutput);
  } catch (error) {
    console.log(error);
  }
};

export default function textSplitted() {
  console.log(getSplittedText());
}
