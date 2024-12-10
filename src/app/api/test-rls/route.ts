import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { auth } from "@clerk/nextjs/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false
    }
  }
)

// Test endpoint: /api/test-rls
export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const testResults = {
      insert: {
        document: "" as string,
        quiz: "" as string
      },
      select: {
        document: "" as string,
        quiz: "" as string
      },
      errors: [] as { test: string; error: string }[]
    }

    // Test 1: Insert Document
    const { error: docError } = await supabase
      .from('documents')
      .insert({
        title: "Test Document",
        user_id: userId
      })
      .select()
      .single()

    testResults.insert.document = docError ? "Failed" : "Success"
    if (docError) testResults.errors.push({ test: "Insert Document", error: docError.message })

    // Test 2: Insert Quiz
    const { error: quizError } = await supabase
      .from('quizzes')
      .insert({
        title: "Test Quiz",
        user_id: userId,
        topic: "Test Topic"
      })
      .select()
      .single()

    testResults.insert.quiz = quizError ? "Failed" : "Success"
    if (quizError) testResults.errors.push({ test: "Insert Quiz", error: quizError.message })

    // Test 3: Select Documents
    const { error: selectDocError } = await supabase
      .from('documents')
      .select()
      .eq('user_id', userId)

    testResults.select.document = selectDocError ? "Failed" : "Success"
    if (selectDocError) testResults.errors.push({ test: "Select Documents", error: selectDocError.message })

    // Test 4: Select Quizzes
    const { error: selectQuizError } = await supabase
      .from('quizzes')
      .select()
      .eq('user_id', userId)

    testResults.select.quiz = selectQuizError ? "Failed" : "Success"
    if (selectQuizError) testResults.errors.push({ test: "Select Quizzes", error: selectQuizError.message })

    return NextResponse.json({
      success: true,
      testResults,
      message: "RLS tests completed"
    })

  } catch (error) {
    console.error('Test failed:', error)
    return NextResponse.json({ error: "Test failed" }, { status: 500 })
  }
}