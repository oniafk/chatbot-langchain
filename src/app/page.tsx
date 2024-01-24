import textSplitted from "../langchain/textSplitter";
import creatingVectorStore from "../supabase/client";

export default function Home() {
  creatingVectorStore();
  textSplitted();
  return (
    <main className="absolute inset-0 flex justify-center items-center">
      website content
    </main>
  );
}
