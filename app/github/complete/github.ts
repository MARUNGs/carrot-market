import { NextRequest } from "next/server";

/**
 * github의 임시코드를 access_token으로 변경
 * @param request
 * @returns
 */
export async function getAccessToken(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return new Response(null, { status: 400 });

  // access token을 생성하기 위해 다시 redirect 처리
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();

  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;

  // POST로 다시 github에게 전달해야 access token 정보를 받을 수 있다.
  const { error, access_token } = await (
    await fetch(accessTokenURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  // error가 발견되면 400 error를 띄운다.
  if (error) {
    return new Response(null, { status: 400 });
  }

  return access_token;
}

/**
 * github의 프로필 정보 조회
 * @param access_token
 * @returns
 */
export async function getGithubProfile(access_token: string) {
  // access token을 사용하여 Github API에 access한다.
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    // 기본적으로 GET API로 설정되는데, NextJS에 의해 GET은 캐싱하여 저장하게 됨. github 정보는 cache에 저장하면 안되므로 별도로 설정하자.
    cache: "no-cache",
  });

  const result = await userProfileResponse.json();
  return result;
}

/**
 * github email 정보 조회
 * @param access_token
 */
export async function getGithubEmail(access_token: string) {
  const userProfileEmailResponse = await fetch(
    "https://api.github.com/user/emails",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache",
    }
  );
  const [emailInfo] = await userProfileEmailResponse.json();
  return emailInfo.email;
}
