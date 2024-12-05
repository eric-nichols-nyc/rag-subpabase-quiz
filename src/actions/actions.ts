// user subasae server 
import  {createClerkSupabaseClientSsr} from "@/lib/supabase/server"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

// create an action to retrieve all quizzes for a user of a user
export async function getQuizzesForUser() {
    const { userId } = auth();
    if (!userId) {
        return { error: "Unauthorized" };
    }
    const supabase = await createClerkSupabaseClientSsr();
    const { data } = await supabase.from("quizzes").select("*").eq("user_id", userId);
    
    // Revalidate the path where quizzes are displayed
    revalidatePath('/quizzes');
    
    return data;
}