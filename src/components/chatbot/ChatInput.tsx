"use client";

import {
  FC,
  HTMLAttributes,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import { useMutation } from "@tanstack/react-query";
import { Message } from "@/lib/schemas/message.schema";
import { nanoid } from "nanoid";
import { MessagesContext } from "../../providers/chatContextProvider";
import { toast } from "react-hot-toast";
import { CornerDownLeft, Loader2 } from "lucide-react";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const [customerInput, setCustomerInput] = useState<string>("");

  const {
    messages,
    addMessage,
    removeMessage,
    updateMessage,
    setIsMessageUpdating,
  } = useContext(MessagesContext);

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

      let llmResponse = response.body;

      return llmResponse;
    },

    onMutate(message) {
      addMessage(message);
    },

    onSuccess: async (stream) => {
      if (!stream) throw new Error("No response from server");
      const id = nanoid();
      const responseMessage: Message = {
        id,
        isUserMessage: false,
        text: "",
      };

      addMessage(responseMessage);

      setIsMessageUpdating(false);

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        let textValue = decoder.decode(value);

        if (
          typeof textValue === "string" &&
          textValue.startsWith('"') &&
          textValue.endsWith('"')
        ) {
          textValue = textValue.slice(1, -1);
        }
        updateMessage(id, (prevText) => prevText + textValue);
      }

      setIsMessageUpdating(false);
      setCustomerInput("");

      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 10);
    },

    onError(_, message) {
      toast.error("Failed to send message");
      removeMessage(messages[0].id);
      textAreaRef.current?.focus();
    },
  });

  const showcustomerinput = () => {};

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
          disabled={isPending}
          placeholder="Type your message here..."
          className="peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 px-2 text-gray-900 focus:ring-0 text-sm sm:leading-6"
        />

        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <kbd className="inline-flex items-center rounded border bg-white border-gray-200 px-1 font-sans text-xs text-gray-400">
            {isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <CornerDownLeft className="w-3 h-3" />
            )}
          </kbd>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 border-t border-gray-300  peer-focus:border-t-2 peer-focus:border-indigo-600"
        ></div>
      </div>
    </div>
  );
};

export default ChatInput;
