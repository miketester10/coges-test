import React from "react";
import { useStore } from "../store/useStore";

/**
 * Componente per visualizzare le statistiche dettagliate
 */
const StatsGrid: React.FC = () => {
  const { result } = useStore();

  if (!result) {
    return null;
  }

  const incorrectAnswers = result.totalQuestions - result.totalCorrect;

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="stat-card stat-card-green">
        <p className="text-sm mb-1">Risposte Corrette</p>
        <p className="text-3xl font-bold">{result.totalCorrect}</p>
      </div>
      <div className="stat-card stat-card-red">
        <p className="text-sm mb-1">Risposte Errate</p>
        <p className="text-3xl font-bold">{incorrectAnswers}</p>
      </div>
    </div>
  );
};

export default StatsGrid;
