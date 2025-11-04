import React from "react";
import { useStore } from "../store/useStore";

/**
 * Componente per visualizzare le informazioni utente e test
 */
const UserInfoCard: React.FC = () => {
  const { result } = useStore();

  if (!result) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Utente</p>
          <p className="text-xl font-semibold text-gray-800">{result.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Test</p>
          <p className="text-xl font-semibold text-gray-800">{result.testTitle}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
