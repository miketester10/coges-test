import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllTests, getTestById, createSession } from "../services/api.service";
import { useSessionStore } from "../store/useSessionStore";
import { UserSession } from "../interfaces/api.interfaces";
import { AxiosError } from "axios";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedTestId, setSelectedTestId] = useState("");
  const [validationError, setValidationError] = useState("");

  // Zustand store
  const setSession = useSessionStore((state) => state.setSession);

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

    // Validazione: nome e test obbligatori
    if (!name.trim()) {
      setValidationError("Il nome è obbligatorio");
      return;
    }

    if (!selectedTestId) {
      setValidationError("Devi selezionare un test");
      return;
    }

    try {
      // Recupera dettagli del test (se non presenti nella cache)
      const testDetailData = testDetail || (await fetchTestDetail()).data;

      if (!testDetailData) {
        setValidationError(`Errore nel caricamento del test selezionato`);
        return;
      }

      // Crea nuova sessione
      const sessionResponse = await createSessionMutation.mutateAsync({
        name: name.trim(),
        testId: selectedTestId,
      });

      // Trova il test selezionato per passare il titolo
      const selectedTest = tests?.find((t) => t.id === selectedTestId);

      // Crea la sessione utente
      const userSession: UserSession = {
        name: name.trim(),
        testId: selectedTestId,
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
      const errorMessage = error instanceof AxiosError ? error.response?.data?.message || error.message : error instanceof Error ? error.message : "Errore durante l'invio della risposta";
      setValidationError(errorMessage);
      console.error(error);
    }
  };

  // Determina lo stato di loading complessivo
  const isLoading = testsLoading || testDetailLoading || createSessionMutation.isPending;

  // Messaggi di errore da visualizzare
  const displayError = validationError || (testsError ? "Errore nel caricamento dei test" : "") || (testDetailError ? `Errore nel caricamento del test selezionato` : "");

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
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Il tuo nome *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setValidationError("");
              }}
              className="form-input"
              placeholder="Inserisci il tuo nome"
              disabled={isLoading}
            />
          </div>

          {/* Test Selection */}
          <div className="form-group">
            <label htmlFor="test" className="form-label">
              Scegli un test *
            </label>
            <select
              id="test"
              value={selectedTestId}
              onChange={(e) => {
                setSelectedTestId(e.target.value);
                setValidationError("");
              }}
              className="form-select"
              disabled={isLoading}
            >
              <option value="">-- Seleziona un test --</option>
              {tests?.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.title} ({test._count.questions} domande)
                </option>
              ))}
            </select>
            {selectedTestId && <p className="mt-2 text-sm text-gray-600">{tests?.find((t) => t.id === selectedTestId)?.description}</p>}
          </div>

          {/* Error Message */}
          {displayError && <div className="alert alert-error">{displayError}</div>}

          {/* Submit Button */}
          <button type="submit" disabled={isLoading} className="btn btn-primary btn-full btn-lg">
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
