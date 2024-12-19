import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  const path = request.nextUrl.pathname;    //It is inbluit function which is used to get the current path of the url

  //Now there are two paths. public and private path.On the basis of cookies, we can different them.

  const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail';   //Declera which paths are public paths

  const token = request.cookies.get("token")?.value || "";   //It is used to get the token from the cookies.

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/profile", request.url));   //If the token is present then it will redirect to the home page.
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));   //If the token is not present then it will redirect to the login page.
  }

}

// Here macher means in which router, we want to apply this middleware.
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/verifyemail',
    '/profile',
  ]
};
