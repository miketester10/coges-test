import React from "react";
import { useStore } from "../store/useStore";

/**
 * Componente per visualizzare il punteggio principale
 */
const ScoreCard: React.FC = () => {
  const { result } = useStore();

  if (!result) {
    return null;
  }

  const percentage = (result.totalCorrect / result.totalQuestions) * 100;

  return (
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
  );
};

export default ScoreCard;
