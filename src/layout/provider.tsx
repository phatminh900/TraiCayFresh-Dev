"use client";
import dotenv from "dotenv";
import path from "path";
import { trpc } from "@/trpc/trpc-client";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const queryClient=new QueryClient()
const trpcClient=  trpc.createClient({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trpc`,
      fetch: (url, options) => {
        return fetch(url, { ...options, credentials: "include" });
      },
    }),
  ],
})
const Provider = ({ children }: PropsWithChildren) => {
 
  return (
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default Provider;
