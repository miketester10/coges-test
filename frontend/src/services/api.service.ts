import axios from "axios";
import { Test, TestDetail, Question, CreateSessionRequest, CreateSessionResponse, AnswerRequest, AnswerResponse, CompleteTestResponse } from "../interfaces/api.interfaces";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------------
// Tests API
// -------------------------

export const getAllTests = async (): Promise<Test[]> => {
  const response = await api.get<Test[]>("/tests");
  return response.data;
};

export const getTestById = async (testId: string): Promise<TestDetail> => {
  const response = await api.get<TestDetail>(`/tests/${testId}`);
  return response.data;
};

// -------------------------
// Questions API
// -------------------------

export const getQuestionById = async (questionId: string): Promise<Question> => {
  const response = await api.get<Question>(`/questions/${questionId}`);
  return response.data;
};

// -------------------------
// Sessions API
// -------------------------

export const createSession = async (data: CreateSessionRequest): Promise<CreateSessionResponse> => {
  const response = await api.post<CreateSessionResponse>("/sessions", data);
  return response.data;
};

// -------------------------
// Attempts API
// -------------------------

export const submitAnswer = async (attemptId: string, data: AnswerRequest): Promise<AnswerResponse> => {
  const response = await api.post<AnswerResponse>(`/attempts/${attemptId}/answer`, data);
  return response.data;
};

export const completeTest = async (attemptId: string): Promise<CompleteTestResponse> => {
  const response = await api.post<CompleteTestResponse>(`/attempts/${attemptId}/complete`);
  return response.data;
};
