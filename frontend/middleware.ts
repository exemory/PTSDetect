import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/', '/profile'];

export async function middleware(req: NextRequest) {
  const isAuthenticated = false;

  if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}
