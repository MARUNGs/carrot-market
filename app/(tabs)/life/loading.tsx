import Skeleton from "@/components/Skeleton";

export default function LifeLoading() {
  const tabNm = "life";

  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} tabNm={tabNm} />
      ))}
    </div>
  );
}
