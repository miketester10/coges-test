import React, { JSX } from "react";

interface ErrorDisplayProps {
  error: string | string[] | null;
  className?: string;
}

/**
 * Componente per visualizzare errori in modo elegante.
 * Gestisce sia errori singoli che multipli (array).
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, className = "" }): JSX.Element | null => {
  // Se l'errore è null, non renderizzare nulla
  if (!error) return null;

  // Se l'errore è una stringa vuota, non renderizzare nulla
  if (typeof error === "string" && error.trim() === "") return null;

  // Se l'errore è un array vuoto, non renderizzare nulla
  if (Array.isArray(error) && error.length === 0) return null;

  // Caso 1: Errore singolo (stringa)
  if (typeof error === "string") {
    return <div className={`alert alert-error ${className}`}>{error}</div>;
  }

  // Caso 2: Errori multipli (array)
  if (Array.isArray(error)) {
    // Se c'è un solo errore nell'array, mostralo come stringa singola
    if (error.length === 1) {
      return <div className={`alert alert-error ${className}`}>{error[0]}</div>;
    }

    // Se ci sono più errori, mostrali come lista
    return (
      <div className={`alert alert-error ${className}`}>
        <div className="font-semibold mb-3">Correggi i seguenti errori:</div>
        <ul className="space-y-2 pl-1">
          {error.map((err, index) => (
            <li key={index} className="flex items-start">
              <span className="text-red-600 font-bold mt-0.5 inline-block" style={{ marginRight: "10px" }} aria-hidden="true">
                •
              </span>
              <span className="flex-1">{err}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};

export default ErrorDisplay;
