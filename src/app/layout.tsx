import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/chatbot";
import StandaloneQuestion from "../langchain/retriveStandaloneQuestion";

import ContextProvider from "@/providers/contextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chatbot for your store",
  description: "Your future customer's best tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ContextProvider>
        <body className={inter.className}>
          {children}
          <Chatbot />
          <StandaloneQuestion />
        </body>
      </ContextProvider>
    </html>
  );
}
