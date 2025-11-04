import { z } from "zod";

/**
 * Schema per validare la creazione di una sessione
 * Corrisponde a CreateSessionDto nel backend:
 * - name: string (IsString, IsNotEmpty)
 * - testId: string (IsMongoId, IsNotEmpty)
 */
export const createSessionSchema = z.object({
  name: z.string().trim().nonempty({ message: "Il nome è obbligatorio" }),
  testId: z
    .string()
    .trim()
    .regex(/^[a-f\d]{24}$/i, { message: "Devi selezionare un test prima di continuare" }),
});

/**
 * Schema per validare una risposta
 * Corrisponde a AnswerDto nel backend:
 * - questionId: string (IsMongoId, IsNotEmpty)
 * - chosenOptionId: string (IsMongoId, IsNotEmpty)
 */
export const answerSchema = z.object({
  questionId: z
    .string()
    .trim()
    .regex(/^[a-f\d]{24}$/i, { message: "La domanda non ha un ID valido" }),
  chosenOptionId: z
    .string()
    .trim()
    .regex(/^[a-f\d]{24}$/i, { message: "Devi selezionare una risposta prima di continuare" }),
});

// Export dei tipi inferiti dagli schema Zod
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type AnswerInput = z.infer<typeof answerSchema>;
