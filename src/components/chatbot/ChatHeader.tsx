import Image from "next/image";
import chatbotimage from "../../../public/chatbot.svg";

export default function ChatHeader() {
  return (
    <div className=" w-full flex-gap-3 justify-start items-center text-zinc-800">
      <div className=" flex flex-col items-start text-sm">
        <p className="text-xs no-underline">chat with</p>
        <div className="flex gap-1.5 items-center">
          <p className=" w-2 h-2 rounded-full bg-green-400" />

          <p className="font-medium no-underline"> Chat support</p>
        </div>
      </div>
    </div>
  );
}
