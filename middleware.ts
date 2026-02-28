import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from '@/i18n/navigation';

const intlMiddleware = createMiddleware(routing);

const protectedRoutes = [
  '/explore',
  '/analysis',
  '/recommend',
  '/feasibility',
  '/compare',
  '/search',
  '/saved',
];

export default async function middleware(request: NextRequest) {
  // 1. Run next-intl middleware first for locale routing
  const response = intlMiddleware(request);

  // 2. Skip auth check if Supabase is not configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  // 3. Refresh Supabase session
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Protect dashboard routes
  const { pathname } = request.nextUrl;
  const pathnameWithoutLocale = pathname.replace(/^\/(ko|en)/, '');

  const isProtected = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  if (isProtected && !user) {
    const locale = pathname.startsWith('/en') ? 'en' : 'ko';
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
