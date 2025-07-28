import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { DataProvider } from "@/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <App />
      </DataProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
