import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TestResult } from "../interfaces/api.interfaces";

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state as TestResult | null;

  // Redirect se non ci sono risultati
  useEffect(() => {
    if (!result) {
      navigate("/");
    }
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  const percentage = (result.totalCorrect / result.totalQuestions) * 100;
  const isPassed = percentage >= 60;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl">
        {/* Success/Fail Icon */}
        <div className="text-center mb-6">
          {isPassed ? (
            <div className="result-icon result-icon-success">
              <svg className="icon icon-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="result-icon result-icon-warning">
              <svg className="icon icon-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          )}

          <h1 className="text-4xl font-bold text-gray-800 mb-2">{isPassed ? "Congratulazioni!" : "Test Completato"}</h1>
          <p className="text-gray-600 text-lg">{isPassed ? "Hai superato il test con successo!" : "Continua a studiare, puoi fare meglio!"}</p>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Utente</p>
              <p className="text-xl font-semibold text-gray-800">{result.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Test</p>
              <p className="text-xl font-semibold text-gray-800">{result.testTitle}</p>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-gradient-primary rounded-xl p-8 text-white mb-6">
          <div className="text-center mb-6">
            <p className="text-lg mb-2">Il tuo punteggio</p>
            <p className="text-6xl font-bold mb-2">
              {result.totalCorrect}/{result.totalQuestions}
            </p>
            <p className="text-2xl font-semibold">{Math.round(percentage)}%</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden">
            <div className="bg-white h-4 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="stat-card stat-card-green">
            <p className="text-sm mb-1">Risposte Corrette</p>
            <p className="text-3xl font-bold">{result.totalCorrect}</p>
          </div>
          <div className="stat-card stat-card-red">
            <p className="text-sm mb-1">Risposte Errate</p>
            <p className="text-3xl font-bold">{result.totalQuestions - result.totalCorrect}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button onClick={() => navigate("/")} className="btn btn-primary flex-1">
            Torna alla Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
