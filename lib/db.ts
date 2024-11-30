// Prisma Client 호출
import { IUser } from "@/app/types/ParamsInterface";
import { IUserResult } from "@/app/types/ReturnInterface";
import { PrismaClient } from "@prisma/client";
import { DbResult } from "./common-model";

// Prisma Client 초기화
const db = new PrismaClient();

/**
 * [회원가입] username 조회
 * @param username
 * @returns
 */
export async function findUser(username: string): Promise<IUserResult> {
  const user = await db.user.findUnique({
    where: { name: username },
    select: { id: true },
  });

  return DbResult(user);
}

/**
 * [회원가입] email 조회
 * @param email
 * @returns
 */
export async function findEmail(email: string): Promise<IUserResult> {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return DbResult(user);
}

/**
 * [회원가입] 유저 생성
 * @param data
 * @returns
 */
export async function createUser(data: IUser): Promise<IUserResult> {
  const createUser = await db.user.create({
    data,
    select: { id: true },
  });

  return DbResult(createUser);
}

/*************************************************************/

/**
 * [로그인] DB에서 입력한 이메일을 보유한 유저를 찾는다.
 * @param email
 * @returns
 */
export async function fineUserPassword(email: string) {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, password: true },
  });

  return DbResult(user);
}

/*************************************************************/

/**
 * [상품페이지] 상품리스트 조회
 * @returns
 */
export async function findProducts() {
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
    },
  });

  const result = {
    success: Boolean(products) ? true : false,
    data: products,
  };

  return result;
}

export default db;

/*
  사용자는 타입스크립트를 이용해서 SQL을 만들었고 SQL로서 DB로 전달되었다.
  DB는 SQL 객체로 응답하게 된다.
  Prisma는 응답받은 결과값을 타입스크립트 객체로 변경하여 보여준다.
*/
