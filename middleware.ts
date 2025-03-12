import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  "/api/webhook"
])

export default clerkMiddleware(async (auth, request) => {
    const { userId, orgId } = await auth()
    let path
    if (!isPublicRoute(request)) {
        await auth.protect()
    }

    if(userId && isPublicRoute(request)) {
        path = "/select-org"
        
        if(orgId) {
            path = `/organization/${orgId}`
        }

        const orgSelection = new URL(path, request.url) 
        return NextResponse.redirect(orgSelection)
    }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}