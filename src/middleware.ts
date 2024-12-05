import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
//import { type NextRequest } from 'next/server'
//import { updateSession } from '@/lib/supabase/middleware'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/upload(.*)', '/quiz(.*)','/generate(.*)'])


export default clerkMiddleware(async (auth, req) => {
    const { userId, redirectToSignIn } = await auth()
  
    if (!userId && isProtectedRoute(req)) {
      // Add custom logic to run before redirecting
  
      return redirectToSignIn()
    }
  })

//   export async function middleware(request: NextRequest) {
//     return await updateSession(request)
//   }
  
export const config = {
matcher: [
  "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|.+\\.[\\w]+$).*)",
  "/",
  "/(api|trpc)(.*)"
]};