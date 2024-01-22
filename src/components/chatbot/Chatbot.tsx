import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import ChatHeader from "./ChatHeader";

export default function CursomerServiceChatbot() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="1-item"
      className="relative bg-white z-40 shadow"
    >
      <AccordionItem value="item-1">
        <div className="fixed right-8 w-80 bottom-8 bg-white border border-gray-200 rounded-md overflow-hidden ">
          <div className="w-full h-full flex flex-col">
          <AccordionTrigger className="px-6 border-b bg-slate-300">
          <ChatHeader />
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col h-80">

            </div>
           </AccordionContent> 
          </div>        
        </div>
      </AccordionItem>
        
        
    </Accordion>
  );
}
