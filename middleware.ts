/**
 * middleware는 새로고침할때 한번만 실행되는 것이 아니라, 웹사이트의 모든 request 하나마다 middleware가 실행된다.
 * 즉, middleware는 내가 원하는 모든 request를 가로챌 수 있다.
 */
import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

const publicOnlyUrls = new Set(["/", "/login", "/sms", "/create-account"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl; // 사용자가 가려는 다음 url
  const { url } = request;
  const session = await getSession();
  const exists = publicOnlyUrls.has(pathname);

  // 로그인하지 않은 유저이면서 허용되지 않은 url로 접근했을 때 '/'로 이동
  if (!session.id && !exists) {
    return NextResponse.redirect(new URL("/", url));
  }

  // 이미 로그인한 상태이므로 publicOnlyUrls로 갈수없게 막아야 한다.
  if (session.id && exists) {
    return NextResponse.redirect(new URL("/products", url));
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
