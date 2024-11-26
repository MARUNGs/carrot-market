/*
  모든 화면에서 session을 사용할 것이므로 추가했음.
*/
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

// TS에게 Cookie이 어떻게 생겼는지 알려주어야 함.
interface SessionContent {
  id?: number;
}

// 사용자 로그인 처리
// 초기설정: 쿠키명 설정 (암복호화 양방향 가능)
export default function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "delicious-karrot",
    // 쿠키 패스워드는 github에 기록이 남으면 안 되므로 .env 환경설정 파일에서 관리하도록 하자.
    // 느낌표 의미: 타입스크립트에게 .env안에 COOKIE_PASSWORD 변수가 무조건 존재한다는 의미
    password: process.env.COOKIE_PASSWORD!,
  });
}
