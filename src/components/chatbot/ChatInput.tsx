"use client";

import { FC, HTMLAttributes, useContext, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import { useMutation } from "@tanstack/react-query";
import { Message } from "@/lib/schemas/message.schema";
import { nanoid } from "nanoid";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const [customerInput, setCustomerInput] = useState<string>("");

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  textAreaRef.current?.focus();

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (message: Message) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({ messages: [message] }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("response", response);
      return response.body;
    },

    onSuccess: async (stream) => {
      if (!stream) throw new Error("No response from server");
      const id = nanoid();
      const responseMessage: Message = {
        id,
        isUserMessage: false,
        text: "",
      };
    },
  });

  const showcustomerinput = () => {
    console.log("customerInput", customerInput);
  };

  return (
    <div {...props} className={cn("border-t border-zinc-300", className)}>
      <div className="relative mt-4 flex-1 overflow-hidden rounded-lg border-nonde outline-none">
        <TextareaAutosize
          ref={textAreaRef}
          rows={2}
          maxRows={4}
          value={customerInput}
          onChange={(e) => setCustomerInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();

              sendMessage({
                id: nanoid(),
                isUserMessage: true,
                text: customerInput,
              });

              showcustomerinput();
              setCustomerInput("");
            }
          }}
          autoFocus
          placeholder="Type your message here..."
          className="peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 px-2 text-gray-900 focus:ring-0 text-sm sm:leading-6"
        />

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 border-t border-gray-300  peer-focus:border-t-2 peer-focus:border-indigo-600"
        ></div>
      </div>
    </div>
  );
};

export default ChatInput;
