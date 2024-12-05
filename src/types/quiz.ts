export interface QuizData {
  id: string;
  title: string;
  description: string;
  status: string;
  questions: Question[];
  created_at: Date;
  updated_at: Date;
  userId: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string; // Ensure this is included
  explanation: string | null;
  quizId: string; // Ensure this is included
  createdAt: Date; // Ensure this is included
  updatedAt: Date; // Ensure this is included
}

export interface QuizProps {
  quizData: QuizData;
}

