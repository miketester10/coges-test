import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/HomePage";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import NotFound from "./pages/NotFound";

// Configurazione del client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Non fetchare quando la finestra torna in focus (per esempio: dopo essere stata minimizzata, o cambiato tab, ecc.)
      retry: 1, // Riprova solo una volta in caso di errore
      staleTime: 5 * 60 * 1000, // I dati sono considerati "freschi" per 5 minuti (5 * 60 * 1000 ms), quindi non verranno refetchati durante questo periodo e messi in cache. Dopo questo periodo, verranno refetchati quando un componente li richiede di nuovo.
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
