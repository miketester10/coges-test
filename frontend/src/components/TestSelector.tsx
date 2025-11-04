import React from "react";

interface Test {
  id: string;
  title: string;
  description: string;
  _count: {
    questions: number;
  };
}

interface TestSelectorProps {
  tests: Test[] | undefined;
  selectedTestId: string;
  onChange: (testId: string) => void;
  disabled: boolean;
  noTestsAvailable: boolean;
}

/**
 * Componente per la selezione del test
 */
const TestSelector: React.FC<TestSelectorProps> = ({ tests, selectedTestId, onChange, disabled = false, noTestsAvailable = false }) => {
  const selectedTest = tests?.find((t) => t.id === selectedTestId);

  return (
    <div className="form-group">
      <label htmlFor="test" className="form-label">
        Scegli un test *
      </label>

      {noTestsAvailable ? (
        <div className="alert alert-warning">⚠️ Nessun test disponibile al momento</div>
      ) : (
        <>
          <select id="test" value={selectedTestId} onChange={(e) => onChange(e.target.value)} className="form-select" disabled={disabled}>
            <option value="">-- Seleziona un test --</option>
            {tests?.map((test) => (
              <option key={test.id} value={test.id}>
                {test.title} ({test._count.questions} domande)
              </option>
            ))}
          </select>
          {selectedTest && <p className="mt-2 text-sm text-gray-600">{selectedTest.description}</p>}
        </>
      )}
    </div>
  );
};

export default TestSelector;
