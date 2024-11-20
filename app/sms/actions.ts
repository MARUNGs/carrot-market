"use server";
import { z } from "zod";
import validator from "validator";
import { MAX_NUMBER, MIN_NUMBER } from "@/lib/constants";
import { redirect } from "next/navigation";

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
      return { token: true };
    }
  } else {
    // 전화번호가 있다면, token을 받아야 한다.
    const result = tokenSchema.safeParse(token);

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
