// route.ts 파일로 URL 특정 HTTP method 핸들러를 만들 수 있다.

import { redirect } from "next/navigation";

export function GET() {
  const baseURL = "https://github.com/login/oauth/authorize";
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user, user:email", // github에게 우리가 사용자로부터 원하는 데이터가 무엇인지 알리는 것.
    allow_signup: "true", // 사용자의 github에 가입을 허용할지를 구성한다. (true: github계정이 없다면 가입시킨 뒤 로그인승인까지 받음 // false: github 계정이 있는 사용자 한정으로만 로그인승인 받음)
  };

  const formattedParams = new URLSearchParams(params).toString();
  const finalUrl = `${baseURL}?${formattedParams}`;
  return redirect(finalUrl);
}
