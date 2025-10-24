import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestionById, submitAnswer, completeTest } from "../services/api.service";
import { Question, TestResult } from "../interfaces/api.interfaces";
import { UserSession } from "../interfaces/api.interfaces";

const TestPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state as UserSession | null;

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect se non c'è sessione
  useEffect(() => {
    if (!session || !session.attemptId) {
      navigate("/");
      return;
    }
    const loadCurrentQuestion = async () => {
      if (!session) return;

      try {
        setLoading(true);
        const questionId = session.questionIds[session.currentQuestionIndex];
        const question = await getQuestionById(questionId);
        setCurrentQuestion(question);
        setSelectedOptionId("");
      } catch (err) {
        setError("Errore nel caricamento della domanda");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCurrentQuestion();
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  const handleNext = async () => {
    if (!selectedOptionId) {
      setError("Devi selezionare una risposta prima di continuare");
      return;
    }

    setError("");
    setLoading(true);

    if (!session) {
      return null;
    }

    try {
      // Invia la risposta al backend
      await submitAnswer(session.attemptId, {
        questionId: currentQuestion!.id,
        chosenOptionId: selectedOptionId,
      });

      const isLastQuestion = session.currentQuestionIndex === session.totalQuestions - 1;

      if (isLastQuestion) {
        // Completa il test
        const result = await completeTest(session.attemptId);

        // Naviga alla pagina dei risultati
        navigate("/result", {
          state: {
            name: session.name,
            testTitle: session.testTitle,
            totalQuestions: session.totalQuestions,
            totalCorrect: result.totalCorrect,
          } as TestResult,
        });
      } else {
        // Vai alla prossima domanda
        const nextIndex = session.currentQuestionIndex + 1;
        navigate("/test", {
          state: {
            ...session,
            currentQuestionIndex: nextIndex,
          } as UserSession,
          replace: true,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Errore durante l'invio della risposta");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const progress = ((session.currentQuestionIndex + 1) / session.totalQuestions) * 100;

  return (
    <div className="min-h-screen p-4">
      <div className="container max-w-3xl mx-auto">
        {/* Header */}
        <div className="card-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{session.testTitle}</h1>
              <p className="text-gray-600">Utente: {session.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Domanda</p>
              <p className="text-2xl font-bold text-blue-600">
                {session.currentQuestionIndex + 1}/{session.totalQuestions}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">Progresso: {Math.round(progress)}%</p>
        </div>

        {/* Question Card */}
        {loading && !currentQuestion ? (
          <div className="card text-center">
            <div className="spinner"></div>
            <p className="mt-4 text-gray-600">Caricamento domanda...</p>
          </div>
        ) : currentQuestion ? (
          <div className="card">
            {/* Question Text */}
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{currentQuestion.text}</h2>

            {/* Answer Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedOptionId(option.id);
                    setError("");
                  }}
                  disabled={loading}
                  className={`answer-option ${selectedOptionId === option.id ? "selected" : ""}`}
                >
                  <div className="flex items-center">
                    <div className={`radio-indicator ${selectedOptionId === option.id ? "selected" : ""}`}>{selectedOptionId === option.id && <div className="radio-dot"></div>}</div>
                    <span className="text-lg">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Error Message */}
            {error && <div className="alert alert-error">{error}</div>}

            {error === "Hai già completato il test." ? (
              /* Home Button */
              <button onClick={() => navigate("/")} className="btn btn-primary btn-full btn-lg">
                Torna alla Home
              </button>
            ) : (
              /* Next Button */
              <button onClick={handleNext} disabled={loading} className="btn btn-primary btn-full btn-lg">
                {loading ? "Invio..." : session.currentQuestionIndex === session.totalQuestions - 1 ? "Completa Test" : "Prossima Domanda"}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TestPage;
