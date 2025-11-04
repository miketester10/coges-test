import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQuestionById, submitAnswer, completeTest } from "../services/api.service";
import { useStore } from "../store/useStore";
import { AnswerRequest, TestResult } from "../interfaces/api.interfaces";
import { AxiosError } from "axios";
import { answerSchema } from "../schemas/validation.schemas";
import { ZodError } from "zod";
import ErrorDisplay from "../components/ErrorDisplay";
import QuestionHeader from "../components/QuestionHeader";
import QuestionCard from "../components/QuestionCard";

const TestPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOptionId, setSelectedOptionId] = useState<string>("");
  const [validationError, setValidationError] = useState<string | string[]>("");

  // Zustand store
  const { session, updateQuestionIndex, setResult } = useStore();

  // React Query per fetchare i dati
  const currentQuestionId = session?.questionIds[session.currentQuestionIndex];
  const {
    data: currentQuestion,
    isLoading: questionLoading,
    error: questionError,
  } = useQuery({
    queryKey: ["question", currentQuestionId],
    queryFn: () => getQuestionById(currentQuestionId!),
    enabled: !!currentQuestionId,
  });

  // React Mutation per inviare risposta
  const submitAnswerMutation = useMutation({
    mutationFn: ({ attemptId, data }: { attemptId: string; data: AnswerRequest }) => submitAnswer(attemptId, data),
  });

  // React Mutation per completare il test
  const completeTestMutation = useMutation({
    mutationFn: completeTest,
  });

  // Redirect se non c'è sessione
  useEffect(() => {
    if (!session || !session.attemptId) {
      navigate("/");
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  // Gestore click "Prossima Domanda" / "Completa Test"
  const handleNext = async () => {
    if (!currentQuestion) {
      return;
    }

    setValidationError("");

    try {
      // Validazione con Zod
      const validatedData = answerSchema.parse({
        questionId: currentQuestion.id,
        chosenOptionId: selectedOptionId,
      });

      // Invia la risposta al backend con i dati validati
      await submitAnswerMutation.mutateAsync({
        attemptId: session.attemptId,
        data: validatedData,
      });

      const isLastQuestion = session.currentQuestionIndex === session.totalQuestions - 1;

      if (isLastQuestion) {
        // Completa il test
        const completeTestResult = await completeTestMutation.mutateAsync(session.attemptId);

        // Crea il risultato
        const testResult: TestResult = {
          name: session.name,
          testTitle: session.testTitle,
          totalQuestions: session.totalQuestions,
          totalCorrect: completeTestResult.totalCorrect,
        };

        // Salva nello store Zustand
        setResult(testResult);

        // Naviga alla pagina dei risultati
        navigate("/result");
      } else {
        // Vai alla prossima domanda
        const nextIndex = session.currentQuestionIndex + 1;
        updateQuestionIndex(nextIndex);
        setSelectedOptionId("");
      }
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
  const isLoading = questionLoading || submitAnswerMutation.isPending || completeTestMutation.isPending;

  // Messaggi di errore da visualizzare
  const getDisplayError = (): string | string[] | null => {
    if (validationError) {
      return validationError;
    }
    if (questionError) {
      return "Errore nel caricamento della domanda";
    }
    return null;
  };
  const displayError = getDisplayError();

  return (
    <div className="min-h-screen p-4">
      <div className="container max-w-3xl mx-auto">
        {/* Header */}
        <QuestionHeader />

        {/* Loading Question Card */}
        {isLoading && !currentQuestion ? (
          <div className="card text-center">
            <div className="spinner"></div>
            <p className="mt-4 text-gray-600">Caricamento domanda...</p>
          </div>
        ) : currentQuestion ? (
          <div className="card">
            {/* Question Card */}
            <QuestionCard
              questionText={currentQuestion.text}
              options={currentQuestion.options}
              selectedOptionId={selectedOptionId}
              onSelectOption={(optionId) => {
                setSelectedOptionId(optionId);
                setValidationError("");
              }}
              disabled={isLoading}
            />

            {/* Error Message */}
            <ErrorDisplay error={displayError} />

            {typeof displayError === "string" && displayError === "Hai già completato il test." ? (
              /*Show Result Button */
              <button onClick={() => navigate("/result")} className="btn btn-primary btn-full btn-lg">
                Mostra risultato
              </button>
            ) : (
              /* Next Button */
              <button onClick={handleNext} disabled={isLoading} className="btn btn-primary btn-full btn-lg">
                {isLoading && <span className="btn-spinner"></span>}
                {isLoading ? "Invio..." : session.currentQuestionIndex === session.totalQuestions - 1 ? "Completa Test" : "Prossima Domanda"}
              </button>
            )}
          </div>
        ) : (
          <div className="card text-center">
            <p className="text-gray-600">Nessuna domanda disponibile.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
