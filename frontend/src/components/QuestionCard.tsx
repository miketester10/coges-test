import React from "react";
import AnswerOption from "./AnswerOption";
import { AnswerOption as Option } from "../interfaces/api.interfaces";

interface QuestionCardProps {
  questionText: string;
  options: Option[];
  selectedOptionId: string;
  onSelectOption: (optionId: string) => void;
  disabled?: boolean;
}

/**
 * Componente per visualizzare la domanda e le sue opzioni
 */
const QuestionCard: React.FC<QuestionCardProps> = ({ questionText, options, selectedOptionId, onSelectOption, disabled = false }) => {
  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">{questionText}</h2>
      <div className="space-y-3 mb-6">
        {options.map((option) => (
          <AnswerOption key={option.id} id={option.id} text={option.text} isSelected={selectedOptionId === option.id} onSelect={onSelectOption} disabled={disabled} />
        ))}
      </div>
    </>
  );
};

export default QuestionCard;
