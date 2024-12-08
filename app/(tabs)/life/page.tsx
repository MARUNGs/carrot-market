import { getPosts } from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import Link from "next/link";

export const metadata = {
  title: "동네생활",
};

async function Life() {
  const posts = await getPosts();
  console.log(posts);

  return (
    <div className="p-5 flex flex-col">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className={`${clsx(
            "pb-5 mb-5",
            "border-b border-neutral-500",
            "text-neutral-400",
            "flex flex-col gap-2",
            "last:pb-0 last:border-b-0"
          )}`}
        >
          <h2 className={`${clsx("text-white text-lg font-semibold")}`}>
            {post.title}
          </h2>
          <p>{post.description}</p>
          <div className="flex justify-between items-center text-sm">
            <div className={`${clsx("flex items-center gap-4")}`}>
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
              <span> 🔥 </span>
              <span>조회수 :: {post.views}</span>
            </div>

            <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
              <span>
                <HandThumbUpIcon className="size-4" />
                {post._count.likes}
              </span>
              <span>
                <ChatBubbleBottomCenterIcon className="size-4" />
                {post._count.comments}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Life;
