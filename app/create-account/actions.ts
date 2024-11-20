"use server";
import { z } from "zod";

// 1개의 유효성 검사
// const usernameSchema = z.string().min(5).max(10);
// 객체의 유효성 검사
const formSchema = z.object({
  username: z.string().min(3).max(10),
  email: z.string().email(),
  password: z.string().min(10),
  passwordConfirm: z.string().min(10),
});

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  };

  // parse 함수 사용예제
  // try {
  //   // usernameSchema.parse(data.username); // 1개의 유효성 검사
  //   formSchema.parse(data); // 객체 유효성 검사
  // } catch (e) {
  //   console.log(e);
  // }

  // safeParse 함수 사용예제
  const result = formSchema.safeParse(data);
  if (!result.success) return result.error.flatten();
}
