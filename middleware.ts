import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const allowedEmails = (process.env.ALLOWED_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  const isPublicPage =
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname === '/apply' ||
    request.nextUrl.pathname === '/thank-you' ||
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname.startsWith('/api/creator-apply')

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/internal')) {
    const email = user?.email?.toLowerCase() ?? ''
    if (!email || (allowedEmails.length > 0 && !allowedEmails.includes(email))) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/creator-workspace', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
