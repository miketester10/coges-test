import React from "react";
import { useStore } from "../store/useStore";

/**
 * Componente per l'icona di successo/fallimento
 */
const ResultIcon: React.FC = () => {
  const { result } = useStore();

  if (!result) {
    return null;
  }

  const percentage = (result.totalCorrect / result.totalQuestions) * 100;
  const isPassed = percentage >= 60;

  return (
    <>
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
    </>
  );
};

export default ResultIcon;
