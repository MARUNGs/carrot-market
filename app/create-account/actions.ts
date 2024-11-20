"use server";
import { z } from "zod";

// 1개의 유효성 검사
// const usernameSchema = z.string().min(5).max(10);

function checkUsername(username: string): boolean {
  return !username.includes("potato");
}

interface IPasswordProps {
  password: string;
  passwordConfirm: string;
}

function checkPassword({ password, passwordConfirm }: IPasswordProps): boolean {
  return password === passwordConfirm;
}

const passwordRegex = new RegExp(
  // 대소문자, 특정 특수문자 일부 포함여부
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);

// 객체의 유효성 검사
const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "유저명은 문자로 작성해야 합니다.",
        required_error: "유저명은 필수입력입니다.",
      })
      .min(3, "유저명은 최소 3자 이상이어야 합니다.")
      .max(10, "유저명은 최대 10자 이하여야 합니다.")
      .toLowerCase()
      .trim()
      .transform((username) => `🔥${username}🔥`)
      .refine(checkUsername, `특정 단어가 입력되어서는 안 됩니다.`),
    email: z
      .string({
        invalid_type_error: "이메일은 문자로 작성해야 합니다.",
        required_error: "이메일은 필수입력입니다.",
      })
      .toLowerCase()
      .email(),
    password: z
      .string({
        invalid_type_error: "비밀번호는 문자로 작성해야 합니다.",
        required_error: "비밀번호는 필수입력입니다.",
      })
      .min(10, "비밀번호는 최소 10자이상이어야 합니다.")
      .regex(
        passwordRegex,
        "비밀번호는 대소문자 1자, 숫자, 특수문자(#?!@$%^&*-)를 포함해야 합니다."
      ),
    passwordConfirm: z
      .string({
        invalid_type_error: "비밀번호 확인은 문자로 작성해야 합니다.",
        required_error: "비밀번호 확인은 필수입력입니다.",
      })
      .min(10, "비밀번호 확인은 최소 10자 이상이어야 합니다."),
  })
  .refine(checkPassword, {
    message: "비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.",
    path: ["passwordConfirm"], // 어느 항목의 오류인가?를 설정하는 prop
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
  else console.log(result.data);
}
