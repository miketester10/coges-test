import React from "react";

interface ProgressBarProps {
  current: number;
  total: number;
}

/**
 * Componente per la barra di progresso
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-sm text-gray-600 mt-2 text-center">Progresso: {Math.round(progress)}%</p>
    </>
  );
};

export default ProgressBar;
