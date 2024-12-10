"use client";
import clsx from "clsx";
import { HandThumbUpIcon as HandThumbUpIconOutline } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpIconSolid } from "@heroicons/react/24/solid";
import { useOptimistic } from "react";
import { likeAction } from "@/app/post/[id]/actions";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
  userId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
  userId,
}: LikeButtonProps) {
  // Q. 서버에서 mutation 실행완료 되기 전에 유저의 UI를 업데이트할 수 있을까?
  // A. mutation 완료 전에 유저에게 UI를 업데이트 제공해줄 수 있다. :: useOptimistic
  //    useOptimistic(initData, reducer::initData->newData)
  //    첫번째 인자: 초기 데이터. mutation 전의 데이터
  //    두번째 인자: 초기 데이터를 수정하는 함수. 2가지의 인자를 갖는다.
  //      - 첫번째 인자: state
  //      - 두번째 인자: action payload
  //    반환값: 새로운 state
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    ({ isLiked, likeCount }, payload: void) => {
      console.log("[like button]payload", payload);
      return {
        isLiked: !isLiked,
        likeCount: isLiked ? --likeCount : ++likeCount,
      };
    }
  );

  // 좋아요 기능
  async function likeHandler() {
    // 1. Optimistic UI 업데이트
    reducerFn(undefined);

    try {
      await likeAction(postId, userId); // 서버 액션 호출
    } catch (error) {
      console.error("Like action failed:", error);
    }
  }

  return (
    <button
      onClick={likeHandler}
      className={`${clsx(
        "flex items-center gap-2 text-neutral-100 text-sm border border-neutral-100 rounded-full p-2 transition-colors",
        state.isLiked ? "bg-orange-500 text-white" : "hover:bg-neutral-800"
      )}`}
    >
      {state.isLiked ? (
        <HandThumbUpIconSolid className="size-5" />
      ) : (
        <HandThumbUpIconOutline className="size-5 " />
      )}

      {state.isLiked ? (
        <span>{state.likeCount}</span>
      ) : (
        <span>공감하기 ({state.likeCount})</span>
      )}
    </button>
  );
}
