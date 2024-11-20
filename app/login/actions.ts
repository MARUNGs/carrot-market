"use server";
/*
  'use server'가 정의된 화면 내에서는 서버 역할을 하게 된다. 무조건 비동기 함수로 선언되어야 한다.
  form을 이용한 submit기능을 사용할때 보낸 데이터를 확인하려면 input의 name 속성을 사용해야 한다.
*/

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import { redirect } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .string({
      required_error: "비밀번호를 입력하세요.",
    })
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

// Server Action
export async function login(_: any, formData: FormData) {
  // Server Action이 이전에 반환했던 값이 prevState로 매핑된다.

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = formSchema.safeParse(data);
  if (!result.success) {
    console.log(result.error);
    return result.error.flatten();
  } else console.log(result.data);
}
