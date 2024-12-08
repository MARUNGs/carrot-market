import { findLikeStatus, findPost } from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getUserId } from "./actions";
import { unstable_cache as nextCache } from "next/cache";
import LikeButton from "@/components/like-button";

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

        <LikeButton
          isLiked={isLiked}
          likeCount={likeCount}
          postId={Number(postId)}
          userId={Number(userId)}
        />
      </div>
    </div>
  );
}
