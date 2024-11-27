"use server";
import { z } from "zod";
import validator from "validator";
import { MAX_NUMBER, MIN_NUMBER } from "@/lib/constants";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import crypto from "crypto";

// phone 먼저 검사한 뒤에 token을 검사할 것이므로 object()로 감쌀 필요가 없다.

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "잘못된 휴대번호 형식입니다."
  );
// input에서 number로 보내도 실제 받는 건 string이다.
// string을 number로 변환하자.
const tokenSchema = z.coerce.number().min(MIN_NUMBER).max(MAX_NUMBER);

// prevState는 화면단에서 정의한 useFormState의 초기값이 들어가게 된다.
interface ActionState {
  token: boolean;
}

async function getToken(): Promise<string> {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: { token },
    select: { id: true },
  });

  // 어떤 유저가 token을 발급 받고 있을 수 있음.
  return exists ? getToken() : token;
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");

  if (!prevState.token) {
    // 첫 호출
    const result = phoneSchema.safeParse(phone);

    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      // 전화번호 유효성 검증에 성공했다면 다음을 수행한다.

      // delete previous token :: 유저는 하나의 token만 발급받아야 한다.
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });

      // create token
      const token = await getToken();

      await db.sMSToken.create({
        data: {
          token,
          user: {
            // 해당 phone을 가진 user가 존재하는지 알 수 없다. 따라서 connectOrCreate를 사용함.
            connectOrCreate: {
              // phone을 찾고
              where: {
                phone: result.data,
              },
              // update할 유저가 없으면 생성한다.
              create: {
                name: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });

      // twilio를 이용하여 사용자에게 token을 전달한다.

      return { token: true };
    }
  } else {
    // 전화번호가 있다면, token을 받아야 한다.
    const result = tokenSchema.safeParse(token);
    // 전화번호 유효성 검증에 실패했다면 리턴한다.
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      // 로그인 시켜주기
      redirect("/");
    }
  }
}
