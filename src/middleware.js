import { NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import { ROLES } from './constants'

const hasRole = (userRole, role) => {
  return userRole?.toLowerCase() === role?.toLowerCase()
}

export async function middleware(request) {
  const accessToken = request.cookies.get('accessToken')
  let account = null
  const path = request.nextUrl.pathname
  const isPublicPath = ['/login', '/'].includes(path)

  if (accessToken) {
    account = (await jwtDecode(accessToken.value)) || null
  }

  if (isPublicPath && account) {
    if (account?.role === 'Admin') {
      return NextResponse.redirect(new URL('/admin', request.nextUrl))
    }
    if (account?.role === 'Employee') {
      return NextResponse.redirect(new URL('/coffee-shop', request.nextUrl))
    }
  }

  if (!isPublicPath && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  const protectedRouters = {
    '/admin': ROLES.ADMIN,
    '/coffee-shop': ROLES.EMPLOYEE
  }

  const protectedRouter = Object.keys(protectedRouters).find(url => {
    return path.startsWith(url)
  })

  if (protectedRouter && !hasRole(account?.role, protectedRouters[protectedRouter])) {
    return NextResponse.redirect(new URL('/404', request.nextUrl.origin))
  }
}
export const config = {
  matcher: ['/', '/login', '/admin/:path*', '/coffee-shop/:path*']
}
