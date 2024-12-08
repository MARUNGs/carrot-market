"use server";

import { addLikePost, findLikeStatus, removeLikePost } from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

// 좋아요 기능
export async function likeAction(postId: number, userId: number) {
  const result = await findLikeStatus(postId, userId);

  if (result.isLiked) await dislikePost(postId);
  else await likePost(postId);

  // tags에 특정 id를 부여하여 그 like id에 대한 cache를 관리할 수 있다.
  revalidateTag(`like-status-${postId}`);
}

/**
 * 현재 로그인한 유저의 id를 조회한다. :: nextJS cache와 session을 같이 사용할 수 없어서 별도로 조회처리함.
 * @returns
 */
export async function getUserId() {
  const session = await getSession();
  return session?.id;
}

/**
 * 좋아요 조회 :: 현재 로그인한 유저가 postId에 좋아요를 눌렀는지 조회한다.
 * @param postId
 * @returns
 */
export async function getLikeStatus(postId: number) {
  const session = await getSession();
  if (!session?.id) return null;

  const result = await findLikeStatus(postId, session.id);
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
