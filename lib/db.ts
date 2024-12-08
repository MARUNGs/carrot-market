// Prisma Client 호출
import { IUser } from "@/app/types/ParamsInterface";
import { IUserResult } from "@/app/types/ReturnInterface";
import { ProductListResult, ProductResult, UserResult } from "./common-model";
import db from "./prisma-client";

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
 * [상품페이지] 상품리스트 첫 조회 시
 * @returns
 */
export async function findProductListInit() {
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
    },
    take: 1, // 데이터 1개만 호출, Next Cache 를 배루기 위해 임시 주석처리 하였음.
    orderBy: { created_at: "desc" },
  });

  return ProductListResult(products);
}

/**
 * [상품페이지] 상품리스트 조회 (페이지네이션)
 * @returns
 */
export async function findProductList(page: number) {
  console.log("-- 상품리스트를 호출하고 있어요 ... --");
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
    },
    skip: page * 1, // 첫번째 데이터 스킵
    take: 1, // 데이터 1개만 호출
    orderBy: { created_at: "desc" },
  });

  return ProductListResult(products);
}

/**
 * 헤더에 장식할 title 조회
 * @param id
 */
export async function getProdictTitle(id: number) {
  console.log("-- title --");
  const products = await db.product.findUnique({
    where: { id },
    select: {
      title: true,
    },
  });

  return products;
}

/**
 * [상품페이지] 상품 조회
 * @param id
 * @returns
 */
export async function findProduct(id: number) {
  console.log("-- product detail --");
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

/**
 * [Life페이지] 게시글 조회
 * @returns
 */
export async function findPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        // relation으로 연결된 정보를 카운트한다.
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });

  return posts;
}

/**
 * [Life페이지] 게시글 조회
 * 게시글을 조회한다는 것은 조회수가 증가한다는 것.
 * 게시글 조회와 동시에 게시글 수정을 작업한다. :: update 쿼리 사용
 * @param id
 * @returns
 */
export async function findPost(id: number) {
  // update method 단점 :: update할 데이터를 찾지 못할 경우 error 발생한다.
  // 따라서, try - catch 구문을 사용해야 한다.
  try {
    const post = await db.post.update({
      where: { id },
      data: {
        views: {
          increment: 1, // 조회수 1 증가
        },
      },
      include: {
        // user 정보, 댓글 및 좋아요 수 또한 포함시켜줘
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return post;
  } catch (e) {
    return null;
  }
}

/**
 * 좋아요 추가 :: 현재 로그인한 유저가 postId에 좋아요를 누른다.
 * 단, 동일한 postId에 대해 2번이상 좋아요를 누르는 것을 방지한다. try-catch
 * @param postId
 * @param sessionId
 */
export async function addLikePost(postId: number, sessionId: number) {
  try {
    await db.like.create({
      data: {
        // composite ID를 활용하여 좋아요 추가
        userId: sessionId,
        postId,
      },
    });
  } catch (e) {}
}

/**
 * 좋아요 삭제 :: 현재 로그인한 유저가 postId에 누른 좋아요를 삭제한다.
 * @param postId
 * @param sessionId
 */
export async function removeLikePost(postId: number, sessionId: number) {
  try {
    await db.like.delete({
      where: {
        id: {
          userId: sessionId,
          postId,
        },
      },
    });
  } catch (e) {}
}

/**
 * 좋아요 조회 :: 현재 로그인한 유저가 postId에 좋아요를 눌렀는지 조회한다.
 * @param postId
 * @param sessionId
 * @returns
 */
export async function findLike(postId: number, sessionId: number) {
  const like = await db.like.findUnique({
    where: { id: { userId: sessionId, postId } },
  });

  return Boolean(like);
}

export default db;

/*
  사용자는 타입스크립트를 이용해서 SQL을 만들었고 SQL로서 DB로 전달되었다.
  DB는 SQL 객체로 응답하게 된다.
  Prisma는 응답받은 결과값을 타입스크립트 객체로 변경하여 보여준다.
*/
