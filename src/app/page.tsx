import loadText from "../langchain/textLoader";

export default function Home() {
  loadText();
  return (
    <main className="absolute inset-0 flex justify-center items-center">
      website content
    </main>
  );
}
