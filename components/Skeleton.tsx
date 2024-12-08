interface SkeletonProps {
  tabNm: string;
}

export default function Skeleton({ tabNm }: SkeletonProps) {
  return (
    <>
      {tabNm === "products" ? (
        // product 페이지 스켈레톤
        <div className="*:rounded-md flex gap-5 animate-pulse">
          <div className="size-28 rounded-md bg-neutral-700" />
          <div className="flex flex-col gap-2 *:rounded-md">
            <div className="bg-neutral-700 h-5 w-40" />
            <div className="bg-neutral-700 h-5 w-20" />
            <div className="bg-neutral-700 h-5 w-10" />
          </div>
        </div>
      ) : tabNm === "life" ? (
        // life 페이지 스켈레톤
        <div className="flex flex-col gap-2 *:rounded-md">
          <div className="bg-neutral-700 h-5 w-20" />
          <div className="bg-neutral-700 h-5 w-40" />
          <div className="flex gap-2 *:rounded-md">
            <div className="bg-neutral-700 h-5 w-5" />
            <div className="bg-neutral-700 h-5 w-5" />
          </div>
        </div>
      ) : null}
    </>
  );
}
