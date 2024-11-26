/**
 * middleware는 새로고침할때 한번만 실행되는 것이 아니라, 웹사이트의 모든 request 하나마다 middleware가 실행된다.
 * 즉, middleware는 내가 원하는 모든 request를 가로챌 수 있다.
 */
import { NextRequest, NextResponse } from "next/server";

/**
 * function name : middleware 반드시 고정
 * @param request
 * @returns
 */
export async function middleware(request: NextRequest) {
  // 여기서 로그인여부를 확인할 수 있다...!
  const pathname = request.nextUrl.pathname;

  if (pathname === "/") {
    const response = NextResponse.next(); // user에게 제공할 응답을 전해줌
    response.cookies.set("middleware-cookie", "hello!");
    return response;
  }

  if (pathname === "/profile") {
    return Response.redirect(new URL("/", request.url));
  }
}

/**
 * variable name : config 반드시 고정
 * matcher: 지정해둔 특정 경로들에서만 미들웨어가 실행되도록 할 수 있다.
 *          특정 url, 패턴 url, 정규표현식 등 작성이 가능하다.
 */
export const config = {
  // url 작성, 패턴 url, 정규표현식 작성 가능
  // matcher: ["/", "/profile", "/create-account", "/user/:path*"],
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
