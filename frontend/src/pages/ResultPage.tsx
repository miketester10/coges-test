import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import ResultIcon from "../components/ResultIcon";
import UserInfoCard from "../components/UserInfoCard";
import ScoreCard from "../components/ScoreCard";
import StatsGrid from "../components/StatsGrid";

const ResultPage: React.FC = () => {
  const navigate = useNavigate();

  // Zustand store
  const { result, clearSession, clearResult } = useStore();

  // Redirect se non ci sono risultati
  useEffect(() => {
    if (!result) {
      navigate("/");
    }
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl">
        {/* Success/Fail Icon */}
        <div className="text-center mb-6">
          <ResultIcon />
        </div>

        {/* User Info */}
        <UserInfoCard />

        {/* Results Card */}
        <ScoreCard />

        {/* Detailed Stats */}
        <StatsGrid />

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              clearSession();
              clearResult();
              navigate("/");
            }}
            className="btn btn-primary btn-full btn-lg"
          >
            Torna alla Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
