//nextJS가 products 페이지 로딩중일 때 Loading 컴포넌트를 사용한다.
import Skeleton from "@/components/Skeleton";

export default async function Loading() {
  // skeleton: loading중일 때 보여주는 화면
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} tabNm="products" />
      ))}
    </div>
  );
}
