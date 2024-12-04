import { redirect } from "next/navigation"
import { Header } from "@/components/header"
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
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6">Generate Quiz</h1>
        <GenerateQuizForm documents={documents} />
      </main>
    </div>
  )
}

