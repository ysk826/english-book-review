import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/profile', '/books', '/search', '/reset-password']
const AUTH_ROUTES = ['/login', '/register']

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // セッションを更新してクッキーに反映させる
    const { data: { session } } = await supabase.auth.getSession()

    const { pathname } = req.nextUrl

    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

    if (!session && isProtected) {
        const loginUrl = req.nextUrl.clone()
        loginUrl.pathname = '/login'
        return NextResponse.redirect(loginUrl)
    }

    if (session && isAuthRoute) {
        const profileUrl = req.nextUrl.clone()
        profileUrl.pathname = '/profile'
        return NextResponse.redirect(profileUrl)
    }

    return res
}

export const config = {
    matcher: ['/profile/:path*', '/books/:path*', '/search/:path*', '/search', '/login', '/register', '/reset-password'],
}
