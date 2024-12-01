// Prisma Client 호출
import { IUser } from "@/app/types/ParamsInterface";
import { IUserResult } from "@/app/types/ReturnInterface";
import { PrismaClient } from "@prisma/client";
import { ProductListResult, ProductResult, UserResult } from "./common-model";

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

  return UserResult(user);
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

  return UserResult(user);
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

  return UserResult(createUser);
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

  return UserResult(user);
}

/*************************************************************/

/**
 * [상품페이지] 상품리스트 조회
 * @returns
 */
export async function findProductList() {
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
    },
  });

  return ProductListResult(products);
}

/**
 * [상품페이지] 상품 조회
 * @param id
 * @returns
 */
export async function findProduct(id: number) {
  const user = {
    select: { name: true, avatar: true },
  };

  const product = await db.product.findUnique({
    where: { id },
    include: { user }, // 상품 + user의 name, avatar 포함
  });

  return ProductResult(product);
}

/**
 * [상품페이지] 상품 삭제
 * @param id
 * @param userId
 */
export async function removeProduct(id: number, userId: number) {
  await db.product.delete({
    where: { id, userId },
  });
}

export default db;

/*
  사용자는 타입스크립트를 이용해서 SQL을 만들었고 SQL로서 DB로 전달되었다.
  DB는 SQL 객체로 응답하게 된다.
  Prisma는 응답받은 결과값을 타입스크립트 객체로 변경하여 보여준다.
*/
