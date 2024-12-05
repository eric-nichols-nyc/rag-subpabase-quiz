export interface QuizData {
  id: string;
  title: string;
  description: string;
  status: string;
  difficulty: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  quiz_id: string;
  created_at: string;
  updated_at: string;
}

export interface QuizProps {
  quizData: QuizData;
}

