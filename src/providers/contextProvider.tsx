"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MessagesContextProvider } from "./chatContextProvider";
import { FC } from "react";

interface ContextProviderProps {
  children: React.ReactNode;
}

const ContextProvider: FC<ContextProviderProps> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <MessagesContextProvider>{children}</MessagesContextProvider>
    </QueryClientProvider>
  );
};

export default ContextProvider;
