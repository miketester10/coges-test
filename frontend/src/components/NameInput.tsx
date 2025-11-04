import React from "react";

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Componente per l'input del nome utente
 */
const NameInput: React.FC<NameInputProps> = ({ value, onChange, disabled = false }) => {
  return (
    <div className="form-group">
      <label htmlFor="name" className="form-label">
        Il tuo nome *
      </label>
      <input
        type="text"
        id="name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input"
        placeholder="Inserisci il tuo nome"
        disabled={disabled}
      />
    </div>
  );
};

export default NameInput;
