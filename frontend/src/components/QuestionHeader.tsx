import React from "react";
import ProgressBar from "./ProgressBar";
import { useStore } from "../store/useStore";

/**
 * Componente per l'header della pagina test con informazioni e progresso
 */
const QuestionHeader: React.FC = () => {
  const { session } = useStore();

  if (!session) {
    return null;
  }

  const currentQuestion = session.currentQuestionIndex + 1;

  return (
    <div className="card-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{session.testTitle}</h1>
          <p className="text-gray-600">Utente: {session.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Domanda</p>
          <p className="text-2xl font-bold text-blue-600">
            {currentQuestion}/{session.totalQuestions}
          </p>
        </div>
      </div>

      <ProgressBar current={currentQuestion} total={session.totalQuestions} />
    </div>
  );
};

export default QuestionHeader;
