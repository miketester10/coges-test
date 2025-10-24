import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTests, createSession, getTestById } from "../services/api.service";
import { Test, UserSession } from "../interfaces/api.interfaces";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedTestId, setSelectedTestId] = useState("");
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Carica i test disponibili al mount
  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const data = await getAllTests();
      setTests(data);
    } catch (err) {
      setError("Errore nel caricamento dei test");
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validazione: nome e test obbligatori
    if (!name.trim()) {
      setError("Il nome è obbligatorio");
      return;
    }

    if (!selectedTestId) {
      setError("Devi selezionare un test");
      return;
    }

    setLoading(true);

    try {
      // Recupera dettagli del test
      const testDetail = await getTestById(selectedTestId);

      // Crea nuova sessione
      const sessionResponse = await createSession({
        name: name.trim(),
        testId: selectedTestId,
      });

      // Trova il test selezionato per passare il titolo
      const selectedTest = tests.find((t) => t.id === selectedTestId);

      // Naviga alla prima domanda
      navigate("/test", {
        state: {
          name: name.trim(),
          testId: selectedTestId,
          testTitle: selectedTest?.title || "Test",
          attemptId: sessionResponse.attemptId,
          questionIds: testDetail.questions.map((q) => q.id),
          currentQuestionIndex: 0,
          totalQuestions: testDetail.questions.length,
        } as UserSession,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Errore durante la creazione della sessione");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Coges Test Task</h1>
          <p className="text-gray-600">Benvenuto! Inserisci il tuo nome e scegli un test per iniziare</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome Input */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Il tuo nome *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className="form-input"
              placeholder="Inserisci il tuo nome"
              disabled={loading}
            />
          </div>

          {/* Test Selection */}
          <div className="form-group">
            <label htmlFor="test" className="form-label">
              Scegli un test *
            </label>
            <select
              id="test"
              value={selectedTestId}
              onChange={(e) => {
                setSelectedTestId(e.target.value);
                setError("");
              }}
              className="form-select"
              disabled={loading}
            >
              <option value="">-- Seleziona un test --</option>
              {tests.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.title} ({test._count.questions} domande)
                </option>
              ))}
            </select>
            {selectedTestId && <p className="mt-2 text-sm text-gray-600">{tests.find((t) => t.id === selectedTestId)?.description}</p>}
          </div>

          {/* Error Message */}
          {error && <div className="alert alert-error">{error}</div>}

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg">
            {loading ? "Caricamento..." : "Inizia il Test"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>* Campi obbligatori</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
