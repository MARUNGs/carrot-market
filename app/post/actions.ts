"use server";

import { addLikePost, findLike, removeLikePost } from "@/lib/db";
import getSession from "@/lib/session";

/**
 * 좋아요 조회 :: 현재 로그인한 유저가 postId에 좋아요를 눌렀는지 조회한다.
 * @param postId
 * @returns
 */
export async function getLike(postId: number) {
  const session = await getSession();
  if (!session?.id) return null;

  const result = await findLike(postId, session.id);
  return result;
}

/**
 * 좋아요 추가 :: 현재 로그인한 유저가 postId에 좋아요를 누른다.
 * @param postId
 * @returns
 */
export async function likePost(postId: number) {
  const session = await getSession();
  if (!session?.id) return null;

  await addLikePost(postId, session.id);
}

/**
 * 좋아요 삭제 :: 현재 로그인한 유저가 postId에 누른 좋아요를 삭제한다.
 * @param postId
 * @returns
 */
export async function dislikePost(postId: number) {
  const session = await getSession();
  if (!session?.id) return null;

  await removeLikePost(postId, session.id);
}
