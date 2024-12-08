import { findPost } from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";
import { dislikePost, getLike, likePost } from "../actions";
import { revalidatePath } from "next/cache";

interface PostDetailProps {
  params: { id: string };
}

export default async function PostDetail({ params }: PostDetailProps) {
  const postId = Number(params.id);
  if (isNaN(postId)) return notFound();

  const post = await findPost(postId); // 게시글 조회
  if (!post) return notFound();

  // 좋아요 기능
  async function likeAction() {
    "use server";

    if (await getLike(postId)) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }

    revalidatePath(`/posts/${postId}`);
  }

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
            className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 hover:bg-neutral-800 transition-colors`}
          >
            <HandThumbUpIcon className="size-5" />
            <span>공감하기 ({post._count.likes})</span>
          </button>
        </form>
      </div>
    </div>
  );
}
