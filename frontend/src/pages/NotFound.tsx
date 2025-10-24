import React from "react";
import { Link } from "react-router-dom";

export const NotFound: React.FC = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>404 — Pagina non trovata</h1>
      <p>La pagina che stai cercando non esiste o è stata spostata.</p>
      <p>
        <Link to="/">Torna alla Home</Link>
      </p>
    </div>
  );
};

export default NotFound;
