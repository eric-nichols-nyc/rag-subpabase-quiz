// user subasae server 
import  {createClerkSupabaseClientSsr} from "@/lib/supabase/server"
import { auth } from "@clerk/nextjs/server"

// create an action to retrieve all quizzes for a user of a user
export async function getQuizzesForUser() {
    const { userId } = auth();
    if (!userId) {
        return { error: "Unauthorized" };
    }
    const supabase = await createClerkSupabaseClientSsr();
    const { data } = await supabase.from("quizzes").select("*").eq("user_id", userId);
    return data;
}