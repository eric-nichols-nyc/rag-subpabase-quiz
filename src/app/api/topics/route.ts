import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from "@clerk/nextjs/server";
import { createClerkSupabaseClientSsr } from '@/lib/supabase/server';
import { OpenAI } from 'openai';
import { revalidatePath } from "next/cache";

const openai = new OpenAI();

interface ChunkResult {
    id: string;
    content: string;
    embedding: number[];
    document_id: string;
    created_at: string;
    updated_at: string;
    metadata: unknown;
    similarity: number;
}

interface QuizQuestion {
    question: string;
    correctAnswer: string;
    incorrectAnswers: string[];
    explanation: string;
}

const MIN_CHUNKS_REQUIRED = 2;

export async function POST(request: NextRequest) {
    const supabase = await createClerkSupabaseClientSsr();

    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { topic, numQuestions = 5, difficulty = 'medium', title } = await request.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        // Count total chunks for debugging
        const { count } = await supabase
            .from('document_chunks')
            .select('*', { count: 'exact', head: true });
        
        console.log('Total chunks in database:', count);

        // Generate embedding for search
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: topic.toLowerCase(),
        });

        const topicEmbedding = embeddingResponse.data[0].embedding;

        // Try different thresholds
        let relatedChunks: ChunkResult[] | null = null;
        const thresholds = [0.5, 0.4, 0.3, 0.2];

        for (const threshold of thresholds) {
            console.log(`Trying threshold: ${threshold}`);
            
            const { data: chunks, error } = await supabase.rpc(
                'find_related_content',
                {
                    query_embedding: topicEmbedding,
                    match_threshold: threshold,
                    match_count: 20
                }
            );

            if (error) {
                console.error(`Search error at threshold ${threshold}:`, error);
                continue;
            }

            console.log(`Found ${chunks?.length || 0} chunks at threshold ${threshold}`);

            if (chunks && chunks.length >= MIN_CHUNKS_REQUIRED) {
                relatedChunks = chunks;
                break;
            }
        }

        // Fallback to text search if needed
        if (!relatedChunks || relatedChunks.length < MIN_CHUNKS_REQUIRED) {
            const { data: directChunks } = await supabase
                .from('document_chunks')
                .select()
                .ilike('content', `%${topic}%`)
                .limit(10);

            console.log('Fallback text search results:', directChunks?.length || 0);
            console.log('Fallback text search results:', directChunks);

            if (directChunks && directChunks.length >= MIN_CHUNKS_REQUIRED) {
                relatedChunks = directChunks.map(chunk => ({
                    ...chunk,
                    similarity: 0.7
                }));
            } else {
                return NextResponse.json({
                    error: "Insufficient content found for this topic",
                    code: "INSUFFICIENT_CONTENT"
                }, { status: 400 });
            }
        }

        // Use the found chunks
        const combinedContent = relatedChunks
            .map(chunk => chunk.content)
            .join('\n');

        // Generate the quiz
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: `You are a quiz generator specializing in ${topic}. Create ${numQuestions} multiple-choice questions at ${difficulty} difficulty level. Include explanations.`
                },
                {
                    role: "user",
                    content: `Using this content: ${combinedContent}\n\nGenerate a quiz about ${topic}.`
                }
            ],
            response_format: { type: "json_object" }
        });

        const quizContent = JSON.parse(completion.choices[0].message.content!);

        // Store the quiz
        const { data: quiz, error: quizError } = await supabase
            .from('quizzes')
            .insert({
                user_id: userId,
                title,
                topic,
                difficulty
            })
            .select()
            .single();

        if (quizError) {
            console.error('Quiz storage error:', quizError);
            throw quizError;
        }

        // Store the questions
        const questionsData = quizContent.questions.map((q: QuizQuestion) => ({
            quiz_id: quiz.id,
            question: q.question,
            correct_answer: q.correctAnswer,
            incorrect_answers: q.incorrectAnswers,
            explanation: q.explanation
        }));

        const { data: questions, error: questionsError } = await supabase
            .from('questions')
            .insert(questionsData)
            .select();

        if (questionsError) {
            console.error('Questions storage error:', questionsError);
            throw questionsError;
        }

        revalidatePath('/quizzes');

        return NextResponse.json({
            success: true,
            quiz: {
                ...quiz,
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