import { redirect } from "next/navigation"
import { GenerateQuizForm } from "@/components/generate-quiz-form"
import { createClerkSupabaseClientSsr } from "@/lib/supabase/server"
import { auth } from "@clerk/nextjs/server"

const getDocuments = async () => {
  const {userId} = auth()
  const supabase = await createClerkSupabaseClientSsr()
  const { data: documents, error } = await supabase.from('documents').select('*').eq('user_id', userId)
  if (error) {
    throw error
  }
  return documents
}

export default async function GenerateQuizPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const documents = await getDocuments()

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto mt-8 p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-3">Generate Quiz</h1>
          <p className="text-muted-foreground mb-6">
            Create a custom quiz by either selecting one of your uploaded documents 
            or choosing from our predefined topics in React development. Your document-based 
            quiz will be tailored to your content, while topic-based quizzes draw from 
            our curated knowledge base.
          </p>
          <GenerateQuizForm documents={documents} />
        </div>
      </main>
    </div>
  )
}

