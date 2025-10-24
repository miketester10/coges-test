// -------------------------
// Tipi per i Test
// -------------------------

export interface Test {
  id: string;
  title: string;
  description: string;
  _count: {
    questions: number;
  };
}

export interface TestDetail extends Test {
  questions: QuestionReference[];
}

export interface QuestionReference {
  id: string;
}

// -------------------------
// Tipi per le Domande
// -------------------------

export interface Question {
  id: string;
  text: string;
  position: number;
  testId: string;
  options: AnswerOption[];
}

export interface AnswerOption {
  id: string;
  text: string;
  questionId: string;
}

// -------------------------
// Tipi per le Sessioni/Tentativi
// -------------------------

export interface CreateSessionRequest {
  name: string;
  testId: string;
}

export interface CreateSessionResponse {
  attemptId: string;
}

export interface AnswerRequest {
  questionId: string;
  chosenOptionId: string;
}

export interface AnswerResponse {
  message: string;
}

export interface CompleteTestResponse {
  totalCorrect: number;
}

// -------------------------
// Tipi per lo Stato Locale
// -------------------------

export interface UserSession {
  name: string;
  testId: string;
  testTitle: string;
  attemptId: string;
  questionIds: string[];
  currentQuestionIndex: number;
  totalQuestions: number;
}

export interface TestResult {
  name: string;
  testTitle: string;
  totalQuestions: number;
  totalCorrect: number;
}
