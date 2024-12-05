import { NextRequest, NextResponse } from "next/server"
import { createClerkSupabaseClientSsr } from '@/lib/supabase/server';
import { getAuth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClerkSupabaseClientSsr();
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get quiz data
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', params.id)
      .single();

    if (quizError) {
      console.error("Error fetching quiz:", quizError);
      return NextResponse.json({ error: "Error fetching quiz" }, { status: 500 });
    }

    // Get questions for this quiz
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', params.id);

    if (questionsError) {
      console.error("Error fetching questions:", questionsError);
      return NextResponse.json({ error: "Error fetching questions" }, { status: 500 });
    }

    // Combine the data
    const quizWithQuestions = {
      ...quiz,
      questions: questions
    };

    return NextResponse.json(quizWithQuestions);
  } catch (error) {
    console.error("Error in quiz route:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

// user can delete a quiz and it's questions
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const supabase = await createClerkSupabaseClientSsr();
        const { userId } = getAuth(request);

        // Verify user
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify quiz ownership
        const { data: quiz } = await supabase
            .from('quizzes')
            .select('user_id')
            .eq('id', params.id)
            .single();

        if (!quiz || quiz.user_id !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Delete questions first (due to foreign key constraint)
        const { error: questionsError } = await supabase
            .from('questions')
            .delete()
            .eq('quiz_id', params.id);

        if (questionsError) {
            console.error("Error deleting questions:", questionsError);
            return NextResponse.json({ error: "Error deleting questions" }, { status: 500 });
        }

        // Delete the quiz
        const { error: quizError } = await supabase
            .from('quizzes')
            .delete()
            .eq('id', params.id);

        if (quizError) {
            console.error("Error deleting quiz:", quizError);
            return NextResponse.json({ error: "Error deleting quiz" }, { status: 500 });
        }

        // Revalidate the quizzes page
        revalidatePath('/quizzes');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in delete route:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}