import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllTests, getTestById, createSession } from "../services/api.service";
import { useStore } from "../store/useStore";
import { UserSession } from "../interfaces/api.interfaces";
import { AxiosError } from "axios";
import { createSessionSchema } from "../schemas/validation.schemas";
import { ZodError } from "zod";
import ErrorDisplay from "../components/ErrorDisplay";
import NameInput from "../components/NameInput";
import TestSelector from "../components/TestSelector";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [selectedTestId, setSelectedTestId] = useState<string>("");
  const [validationError, setValidationError] = useState<string | string[]>("");

  // Zustand store
  const { setSession } = useStore();

  // React Query per fetchare i dati
  const {
    data: tests,
    isLoading: testsLoading,
    error: testsError,
  } = useQuery({
    queryKey: ["tests"],
    queryFn: getAllTests,
  });

  const {
    data: testDetail,
    refetch: fetchTestDetail,
    isLoading: testDetailLoading,
    error: testDetailError,
  } = useQuery({
    queryKey: ["test", selectedTestId],
    queryFn: () => getTestById(selectedTestId),
    enabled: !!selectedTestId,
  });

  // React Mutation per creare sessione
  const createSessionMutation = useMutation({
    mutationFn: createSession,
  });

  // Gestore submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validazione con Zod
    try {
      const validatedData = createSessionSchema.parse({
        name: name,
        testId: selectedTestId,
      });

      // Recupera dettagli del test (se non presenti nella cache)
      const testDetailData = testDetail || (await fetchTestDetail()).data;

      if (!testDetailData) {
        setValidationError(`Errore nel caricamento del test selezionato`);
        return;
      }

      // Crea nuova sessione con i dati validati
      const sessionResponse = await createSessionMutation.mutateAsync(validatedData);

      // Trova il test selezionato per passare il titolo
      const selectedTest = tests?.find((t) => t.id === validatedData.testId);

      // Crea la sessione utente
      const userSession: UserSession = {
        name: validatedData.name,
        testId: validatedData.testId,
        testTitle: selectedTest?.title || "Test",
        attemptId: sessionResponse.attemptId,
        questionIds: testDetailData.questions.map((q) => q.id),
        currentQuestionIndex: 0,
        totalQuestions: testDetailData.questions.length,
      };

      // Salva nello store Zustand
      setSession(userSession);

      // Naviga alla prima domanda
      navigate("/test");
    } catch (error) {
      // Gestione errori
      if (error instanceof ZodError) {
        setValidationError(error.issues.map((e) => e.message));
      } else {
        const errorMessage = error instanceof AxiosError ? error.response?.data?.message || error.message : error instanceof Error ? error.message : "Errore durante l'invio della risposta";
        setValidationError(errorMessage);
      }
    }
  };

  // Determina lo stato di loading complessivo
  const isLoading = testsLoading || testDetailLoading || createSessionMutation.isPending;

  // Controlla se ci sono test disponibili
  const noTestsAvailable = (!tests || tests.length === 0) && !testsLoading;

  // Messaggi di errore da visualizzare
  const getDisplayError = (): string | string[] | null => {
    if (validationError) {
      return validationError;
    }
    if (testsError) {
      return "Errore nel caricamento dei test";
    }
    if (testDetailError) {
      return "Errore nel caricamento del test selezionato";
    }
    return null;
  };
  const displayError = getDisplayError();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Coges Test Task</h1>
          <p className="text-gray-600">Benvenuto! Inserisci il tuo nome e scegli un test per iniziare</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome Input */}
          <NameInput
            value={name}
            onChange={(value) => {
              setName(value);
              setValidationError("");
            }}
            disabled={isLoading || noTestsAvailable}
          />

          {/* Test Selection */}
          <TestSelector
            tests={tests}
            selectedTestId={selectedTestId}
            onChange={(testId) => {
              setSelectedTestId(testId);
              setValidationError("");
            }}
            disabled={isLoading}
            noTestsAvailable={noTestsAvailable}
          />

          {/* Error Message */}
          <ErrorDisplay error={displayError} />

          {/* Submit Button */}
          <button type="submit" disabled={isLoading || noTestsAvailable} className="btn btn-primary btn-full btn-lg">
            {isLoading && <span className="btn-spinner"></span>}
            {isLoading ? "Caricamento..." : "Inizia il Test"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>* Campi obbligatori</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
