import { findLikeStatus, findPost } from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import {
  EyeIcon,
  HandThumbUpIcon as HandThumbUpIconSolid,
} from "@heroicons/react/24/solid";
import { HandThumbUpIcon as HandThumbUpIconOutline } from "@heroicons/react/24/outline";
import Image from "next/image";
import { notFound } from "next/navigation";
import { dislikePost, getUserId, likePost } from "../actions";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import clsx from "clsx";

interface PostDetailProps {
  params: { id: string };
}

export default async function PostDetail({ params }: PostDetailProps) {
  const postId = Number(params.id);
  if (isNaN(postId)) return notFound();

  const userId = await getUserId();

  /* 캐시 관리 */
  // nextCache :: 게시글 조회
  const getCachedPostStatus = nextCache(findPost, ["post"], {
    tags: ["post-detail"],
    revalidate: 60,
  });
  // nextCache :: 좋아요 조회 -> cache함수가 server action이므로 비동기 함수로 정의
  function getCachedLikeStatus(postId: number) {
    const cachedOperation = nextCache(
      async (postId: number) => findLikeStatus(postId, userId),
      ["like"],
      { tags: [`like-status-${postId}`] } // 커스텀 태그 설정가능
    );

    // tags에 특정 id를 부여하여 그 like id에 대한 cache를 관리할 수 있다.
    // 처리법: 함수로 처리하여 postId를 인자로 받고, nextCache를 리턴한다.
    return cachedOperation(postId);
  }

  const post = await getCachedPostStatus(postId);
  if (!post) return notFound();

  // 좋아요 기능
  async function likeAction() {
    "use server";

    // Q. 서버에서 mutation 실행완료 되기 전에 유저의 UI를 업데이트할 수 있을까?
    await new Promise((resolve) => setTimeout(resolve, 5000)); // 강제로 5초 딜레이 부여

    const result = await findLikeStatus(postId, userId);

    if (result.isLiked) await dislikePost(postId);
    else await likePost(postId);

    // tags에 특정 id를 부여하여 그 like id에 대한 cache를 관리할 수 있다.
    revalidateTag(`like-status-${postId}`);
  }

  const { isLiked, likeCount } = await getCachedLikeStatus(postId);

  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Image
          className="size-7 rounded-full"
          src={post.user.avatar!}
          alt={post.user.name}
          width={28}
          height={28}
        />
        <div>
          <span className="text-sm font-semibold">{post.user.name}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>👀 {post.views}</span>
        </div>

        <form action={likeAction}>
          <button
            className={`${clsx(
              "flex items-center gap-2 text-neutral-100 text-sm border border-neutral-100 rounded-full p-2 transition-colors",
              isLiked ? "bg-orange-500 text-white" : "hover:bg-neutral-800"
            )}`}
          >
            {isLiked ? (
              <HandThumbUpIconSolid className="size-5" />
            ) : (
              <HandThumbUpIconOutline className="size-5 " />
            )}

            {isLiked ? (
              <span>{likeCount}</span>
            ) : (
              <span>공감하기 ({likeCount})</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
