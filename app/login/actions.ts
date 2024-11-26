"use server";
import db from "@/lib/db";
/*
  'use server'가 정의된 화면 내에서는 서버 역할을 하게 된다. 무조건 비동기 함수로 선언되어야 한다.
  form을 이용한 submit기능을 사용할때 보낸 데이터를 확인하려면 input의 name 속성을 사용해야 한다.
*/

// import {
//   PASSWORD_MIN_LENGTH,
//   PASSWORD_REGEX,
//   PASSWORD_REGEX_ERROR,
// } from "@/lib/constants";
// import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

/**
	비밀번호 체크
*/
const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "이 이메일은 존재하지 않습니다."),
  password: z.string({
    required_error: "비밀번호를 입력하세요.",
  }),
  // .min(PASSWORD_MIN_LENGTH),
  // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

// Server Action
export async function login(_: any, formData: FormData) {
  // Server Action이 이전에 반환했던 값이 prevState로 매핑된다.

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // * DB에서 입력한 이메일을 보유한 유저를 찾는다. (refine 처리)
    // * 유저를 찾은 경우, 입력한 비밀번호가 일치하는지 찾는다.
    const user = await db.user.findUnique({
      where: { email: result.data.email },
      select: { id: true, password: true },
    });

    // compare: 사용자가 보낸 일반 텍스트와 DB의 해시값을 받는다. 이 평문 문자로 해시값이 만들어졌는가? 맞으면 true, 아니면 false
    const ok = await bcrypt.compare(result.data.password, user!.password ?? "");
    // 이미 유효성검사 과정에서 DB에 저장된 정보를 가져오는 것이기 때문에 password는 반드시 있다고 타입을 선언한다. (!)
    // 그런데, phone 또는 github으로 로그인할 수 있으므로 일단은 password는 비었다면 빈 문자열과 비교하도록 한다.

    // * 유저를 로그인시킨다.
    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      await session.save();

      // * 유저를 '/profile'로 이동시킨다.
      redirect("/profile");
    } else {
      return {
        fieldErrors: { email: [], password: ["잘못된 비밀번호입니다."] },
      };
    }
  }
}
