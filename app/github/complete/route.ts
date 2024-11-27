import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

// github에서 보낸 임시 code parameter를 호출해야 함.
export async function GET(request: NextRequest) {
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

  // access token을 사용하여 Github API에 access한다.
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    // 기본적으로 GET API로 설정되는데, NextJS에 의해 GET은 캐싱하여 저장하게 됨. github 정보는 cache에 저장하면 안되므로 별도로 설정하자.
    cache: "no-cache",
  });

  const { id, avatar_url, login } = await userProfileResponse.json();

  // 해당 Github 계정이 DB에 존재하는지 확인
  const user = await db.user.findUnique({
    where: { github_id: id + "" },
    select: { id: true },
  });

  // DB에 계정이 존재하면 로그인 시킨다.
  if (user) {
    const session = await getSession();
    session.id = user.id;
    await session.save();
    return redirect("/profile");
  }

  // 만약, 다른 플랫폼이지만 DB에 동일한 username이 존재한다면?
  const username = await db.user.findUnique({
    where: { name: login },
    select: { name: true },
  });

  let newLogin = login;
  if (username) {
    newLogin = `${login}-gh`;
  }

  // DB에 계정이 존재하지 않으면 새로 생성하여 DB에 저장한다.
  const newUser = await db.user.create({
    data: {
      name: newLogin,
      github_id: id + "",
      avatar: avatar_url,
    },
    select: { id: true },
  });

  const session = await getSession();
  session.id = newUser.id;
  await session.save();
  return redirect("/profile");
}
