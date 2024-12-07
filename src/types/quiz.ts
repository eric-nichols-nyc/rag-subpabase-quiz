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
  correct_answer: string;
  explanation: string | null;
  quiz_id: string;
  created_at: string;
  updated_at: string;
}

export interface QuizProps {
  quizData: QuizData;
}

