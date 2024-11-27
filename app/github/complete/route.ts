import db from "@/lib/db";
import { getAccessToken, getGithubEmail, getGithubProfile } from "@/lib/github";
import { userLogin } from "@/lib/login";
import { NextRequest } from "next/server";

// github에서 보낸 임시 code parameter를 호출해야 함.
export async function GET(request: NextRequest) {
  const access_token = await getAccessToken(request);
  const { id, avatar_url, login } = await getGithubProfile(access_token);
  const email = await getGithubEmail(access_token);

  // 해당 Github 계정이 DB에 존재하는지 확인
  const user = await db.user.findUnique({
    where: { github_id: id + "" },
    select: { id: true },
  });

  // DB에 계정이 존재하면 로그인 시킨다.
  if (user) {
    await userLogin(user);
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
      email,
    },
    select: { id: true },
  });

  await userLogin(newUser);
}
