"use server";
import { z } from "zod";
import {
  PASSWORD_MIN_LENGTH,
  // PASSWORD_REGEX,
  // PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const db = new PrismaClient(); // Prisma Client 초기화

// const usernameSchema = z.string().min(5).max(10); // 1개의 유효성 검사

/**
 * username을 체크한다. potato 문자열은 삽입금지
 * @param username
 * @returns
 */
function checkUsername(username: string): boolean {
  return !username.includes("potato");
}

interface IPasswordProps {
  password: string;
  passwordConfirm: string;
}

/**
 * 비밀번호 && 비밀번호 확인 체크
 */
function checkPassword({ password, passwordConfirm }: IPasswordProps): boolean {
  return password === passwordConfirm;
}

// 객체의 유효성 검사
const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "유저명은 문자로 작성해야 합니다.",
        required_error: "유저명은 필수입력입니다.",
      })
      .toLowerCase()
      .trim()
      // .transform((username) => `🔥${username}🔥`)
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
      .min(
        PASSWORD_MIN_LENGTH,
        `비밀번호는 최소 ${PASSWORD_MIN_LENGTH}자이상이어야 합니다.`
      ),
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    passwordConfirm: z
      .string({
        invalid_type_error: "비밀번호 확인은 문자로 작성해야 합니다.",
        required_error: "비밀번호 확인은 필수입력입니다.",
      })
      .min(
        PASSWORD_MIN_LENGTH,
        `비밀번호 확인은 최소 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`
      ),
  })
  // 여기서 username 변수는 현재 유효성검사중인 object 내 key값들이다. username, email, password 등
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: { name: username },
      select: { id: true },
    });

    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "사용자명이 이미 사용중입니다.",
        path: ["username"],
        fatal: true, // 해당 이슈는 치명적이다. 라고 정의하는 속성
      });

      return z.NEVER; // zod가 한 항목만 검사하고 나머지는 하지 않게 설정할 수 있다.
      // fatal이 true이면서 zod.NEVER이 리턴되면 다른 refine 함수는 실행되지 않는다.
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "email이 이미 사용중입니다.",
        path: ["email"],
        fatal: true,
      });

      return z.NEVER;
    }
  })
  .refine(checkPassword, {
    message: "비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.",
    path: ["passwordConfirm"], // 어느 항목의 오류인가?를 설정하는 prop
  });

// main function
export async function createAccount(_: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  };

  // parse 함수 사용예제
  /*
  try {
    // usernameSchema.parse(data.username); // 1개의 유효성 검사
    formSchema.parse(data); // 객체 유효성 검사
  } catch (e) {
    console.log(e);
  }
  */

  // safeParse 함수 사용예제
  /**
   * Prisma에 의해 async-await 비동기 함수로 DB에 접근하여 유효성검사를 체크하고 있다.
   * 따라서, zod로 정의된 스키마 또한 비동기 함수로 변경되어야 한다.
   * 즉, zod가 모든 refine 함수에 대해 await하려면 다음과 같이 설정한다.
   * [변경] schema.safeParse() -> await schema.safeParseAsync()
   * safeParseAsync() === spa()
   */
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // check user infomation >>> zod에게 역할을 부여했음. (refine)
    // 패스워드 해싱처리
    const hashPassword = await bcrypt.hash(result.data.password, 12); // hashing 12번 실행

    // 사용자 정보 DB에 저장
    const id = true;
    const user = await db.user.create({
      data: {
        name: result.data.username,
        email: result.data.email,
        password: hashPassword,
      },
      select: { id }, // 생성된 유저의 id만 호출
    });

    const session = await getSession(); // session 호출
    session.id = user.id;
    await session.save();

    // '/profile' 으로 이동
    redirect("/profile");
  }
}
