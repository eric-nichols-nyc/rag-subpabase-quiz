import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from "@clerk/nextjs/server";
import { createClerkSupabaseClientSsr } from '@/lib/supabase/server';
import { OpenAI } from 'openai';
import { revalidatePath } from "next/cache";

const openai = new OpenAI();

type Question = {
    question: string;
    correctAnswer: string;
    incorrectAnswers: string[];
    explanation: string;
}

export async function POST(request: NextRequest) {
    const supabase = await createClerkSupabaseClientSsr();

    try {
        // 1. Auth check
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Get document ID from request
        const { documentId, numQuestions = 10, difficulty = 'HARD', title } = await request.json();
        if (!documentId) {
            return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
        }

        if (!title) {
            return NextResponse.json({ error: "Quiz title is required" }, { status: 400 });
        }

        // Query the document and get the title
        const { data: documentTitle, error: docTitleError } = await supabase
            .from('documents')
            .select('title')
            .eq('id', documentId)
            .single();

        console.log('Document title:', { documentTitle, docTitleError });

        // 3. Query document chunks with better error handling
        const { data: chunks, error: docError } = await supabase
            .from('document_chunks')
            .select('*')
            .eq('document_id', documentId);


        if (docError) {
            console.error('Database error:', docError);
            return NextResponse.json({ error: "Database query failed" }, { status: 500 });
        }

        if (!chunks || chunks.length === 0) {
            console.log('No chunks found for documentId:', documentId);
            return NextResponse.json({ error: "No document chunks found" }, { status: 404 });
        }
        console.log('Query results:', chunks.length); // Log both results and errors

        // Combine chunks for processing
        const fullContent = chunks.map(chunk => chunk.content).join(' ');
        const trimContent = (content: string, maxWords = 1000) => {
            return content.split(' ').slice(0, maxWords).join(' ');
        };

        const trimmedContent = trimContent(fullContent);
        const startTime = Date.now();

        // 4. Generate quiz using OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `Generate ${numQuestions} multiple-choice questions from the text. Return a JSON object with 'questions', each containing:
                  - question: string
                  - correctAnswer: string
                  - incorrectAnswers: array of 3 strings`
                },
                {
                    role: "user",
                    content: trimmedContent
                }
            ],
            response_format: { type: "json_object" },
            max_tokens: 1000
        });

        const questions = completion.choices[0].message.content;
        if (!questions) throw new Error("No content received from OpenAI");
        const quiz = JSON.parse(questions);

        // Validate the response format
        if (!quiz.questions || !Array.isArray(quiz.questions)) {
            throw new Error("Invalid quiz format received from OpenAI");
        }
        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log(`API call duration: ${duration} ms`);
        console.log('Quiz:', quiz);

        // 5. Store quiz in database with unique name handling
        const generateUniqueName = (baseName: string) => {
            const randomString = Math.random().toString(36).substring(2, 5);
            return `${baseName}-${randomString}`;
        };

        let finalTitle = title;
        const { data: existingQuiz } = await supabase
            .from('quizzes')
            .select('id')
            .eq('title', title)
            .eq('user_id', userId)
            .single();

        if (existingQuiz) {
            finalTitle = generateUniqueName(title);
        }

        const { data: quizData, error: quizError } = await supabase
            .from('quizzes')
            .insert({
                user_id: userId,
                title: finalTitle,
                description: `${numQuestions} ${difficulty} questions`,
            })
            .select()
            .single();

        if (quizError) {
            throw quizError;
        }

        // 6. Store all questions in database
        const questionInserts = quiz.questions.map((q: Question) => ({
            quiz_id: quizData.id,
            question: q.question,
            options: [q.correctAnswer, ...q.incorrectAnswers],
            correct_answer: q.correctAnswer,
            explanation: q.explanation
        }));

        const { data, error: questionsError } = await supabase
            .from('questions')
            .insert(questionInserts)
            .select();

        if (questionsError) {
            throw questionsError;
        }

        console.log('Questions:', data.length);

        // Add revalidation after successful quiz creation
        revalidatePath('/quizzes');

        return NextResponse.json({
            success: true,
            quiz: {
                ...quizData,
                questions
            }
        });

    } catch (error) {
        console.error('Error generating quiz:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to generate quiz',
                details: process.env.NODE_ENV === 'development' ? error : undefined
            },
            { status: 500 }
        );
    }
} 