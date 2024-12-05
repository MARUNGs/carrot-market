"use server";
import { z } from "zod";
import validator from "validator";
import { MAX_NUMBER, MIN_NUMBER } from "@/lib/constants";
import db from "@/lib/db";
import crypto from "crypto";
import { userLogin } from "@/lib/login";
import twilio from "twilio";
import { sendMessage } from "../discord/server";

// phone 먼저 검사한 뒤에 token을 검사할 것이므로 object()로 감쌀 필요가 없다.

/**
 * 현재 token이 DB에서 unique한지 조회
 * @param token
 * @returns
 */
async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: { token: token.toString() },
    select: { id: true },
  });

  return Boolean(exists);
}

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "잘못된 휴대번호 형식입니다."
  );
// input에서 number로 보내도 실제 받는 건 string이다.
// string을 number로 변환하자.
const tokenSchema = z.coerce
  .number()
  .min(MIN_NUMBER)
  .max(MAX_NUMBER)
  .refine(tokenExists, "해당 token이 존재하지 않습니다.");

// prevState는 화면단에서 정의한 useFormState의 초기값이 들어가게 된다.
interface ActionState {
  token: boolean;
}

/**
 * Token 생성 및 가져오기(재귀함수)
 * @returns
 */
async function getToken(): Promise<string> {
  const token = crypto.randomInt(MIN_NUMBER, MAX_NUMBER).toString();
  const exists = await db.sMSToken.findUnique({
    where: { token },
    select: { id: true },
  });

  // 어떤 유저가 token을 발급 받고 있을 수 있음.
  return exists ? getToken() : token;
}

interface ActionState {
  token: boolean;
  errors?: {
    token?: string[];
  };
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
        error: result.error.flatten().fieldErrors,
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
            connectOrCreate: {
              where: { phone: result.data },
              create: {
                name: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });

      // twilio를 이용하여 사용자에게 token을 전달한다.
      // 1. twilio client 생성
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      // 20241128. 오류... twilio에서 자체적으로 인증이 안되고 있는 이슈가 있다. 원인을 아직 못찾아서 주석처리함.
      // 2. client로 메세지를 생성한다.
      // await client.messages.create({
      //   body: `당신의 캐럿마켓 인증코드는 ${token}입니다.`,
      //   from: process.env.TWILIO_PHONE_NUMBER!, // 보내는이(twilio 번호)
      //   to: process.env.MY_PHONE!, // 받는이(나)
      //   // 원래는 to의 번호는 사용자가 입력한 전화번호여야 하지만, 현재 twilio 계정이 체험판이므로 제공받은 번호로 사용할 것.
      // });

      console.log(client);
      console.log(token);
      // 해결되기 전까지만 임시로 처리해보도록 하자...

      // 대신 디스코드로 문자를 전송해보자...
      await sendMessage(token);

      return { token: true };
    }
  } else {
    // 전화번호가 있다면, token을 받아야 한다.
    const result = await tokenSchema.spa(token);
    // 전화번호 유효성 검증에 실패했다면 리턴한다.
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      // token을 갖는 userId 찾기
      // 개선. 사용자가 전화번호를 아무렇게나 작성하고 token 인증을 요청할 수도 있다.
      // 이를 방지하기 위한 전화번호 검토가 필요하다. 결과값이 확인되면 token 조회시 phone도 같이 조회할 것.
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: { id: true, userId: true },
      });

      // user 로그인 시켜주기
      await userLogin({ id: token!.userId });

      // 로그인하고 나면 더이상 token은 필요없으므로 완전삭제한다.
      await db.sMSToken.delete({
        where: { id: token!.id },
      });
    }
  }
}

// 코드 챌린지
// 1. 사용자에게 토큰을 넘겼을때, 사용자가 본인과 관련없는 전화번호를 아무거나 적었을 수도 있으니
//    OTP 번호를 추적하여 확인해볼 것.
