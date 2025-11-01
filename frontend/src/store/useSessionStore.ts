import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserSession, TestResult } from "../interfaces/api.interfaces";

interface SessionStore {
  // Session state
  session: UserSession | null;
  result: TestResult | null;

  // Actions
  setSession: (session: UserSession) => void;
  updateQuestionIndex: (index: number) => void;
  clearSession: () => void;

  setResult: (result: TestResult) => void;
  clearResult: () => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      // Initial state
      session: null,
      result: null,

      // Actions
      setSession: (session) => set({ session }),

      updateQuestionIndex: (index) =>
        set((state) => ({
          session: state.session ? { ...state.session, currentQuestionIndex: index } : null,
        })),

      clearSession: () => set({ session: null }),

      setResult: (result) => set({ result }),

      clearResult: () => set({ result: null }),
    }),
    {
      name: "session-storage", // Nome per il localStorage
      partialize: (state) => ({
        // Persisti solo la sessione, non i risultati
        session: state.session,
      }),
    }
  )
);
