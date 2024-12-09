import { z } from "zod";

export const quizSchema = z.object({
    title: z.string().min(1),
    numQuestions: z.number().min(1),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    documentId: z.string().min(1),
});