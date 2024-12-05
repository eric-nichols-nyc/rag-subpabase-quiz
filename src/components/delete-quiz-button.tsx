'use client';

import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { useRouter } from "next/navigation";

async function deleteQuiz(id: string) {
  const response = await fetch(`/api/quiz/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete quiz');
  }
}

export function DeleteQuizButton({ quizId }: { quizId: string }) {
  const router = useRouter();

  return (
    <Button 
      size="icon" 
      variant="outline" 
      className="ml-2"
      onClick={async () => {
        try {
          await deleteQuiz(quizId);
          router.refresh();
        } catch (error) {
          console.error('Error deleting quiz:', error);
        }
      }}
    >
      <Trash2 className="h-4 w-4" color="red"/>
    </Button>
  );
} 