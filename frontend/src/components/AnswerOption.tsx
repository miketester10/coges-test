import React from "react";

interface AnswerOptionProps {
  id: string;
  text: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled: boolean;
}

/**
 * Componente per una singola opzione di risposta
 */
const AnswerOption: React.FC<AnswerOptionProps> = ({ id, text, isSelected, onSelect, disabled }) => {
  return (
    <button onClick={() => onSelect(id)} disabled={disabled} className={`answer-option ${isSelected ? "selected" : ""}`}>
      <div className="flex items-center">
        <div className={`radio-indicator ${isSelected ? "selected" : ""}`}>{isSelected && <div className="radio-dot"></div>}</div>
        <span className="text-lg">{text}</span>
      </div>
    </button>
  );
};

export default AnswerOption;
