import ProductLists from "@/components/product-list";
import { findProductList /*findProductListInit */ } from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import clsx from "clsx";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import Link from "next/link";

// [운영모드일때 작동] NextJS에게 해당 페이지를 강제로 dynamic 페이지라고 인식하게 만듬.
// export const dynamic = "force-dynamic";
// [운영모드일때 작동] Route에 대해서도 설정할 수 있다.
export const revalidate = 60;

/**
 * NextJS Cache 프로세스 순서를 쫓아가보자.
 */

// [2] NextJS가 관리하는 cache key list 중에서 home-products가 관리하는 데이터를 찾게 된다.
//     처음에는 데이터가 없으므로 findProductList action 함수를 이용하여 데이터를 얻게 된다.
// [3] 이제 home-products key에 저장된 cache data를 호출하여 getCachedProducts에 담게 된다.
const getCachedProducts = nextCache(findProductList, ["home-products"], {
  // cache 속성
  // [4] findProductList 함수가 호출되는 순간부터 시간이 흐른다.
  //     유저가 60초 이내에 데이터를 호출하면 cache에 저장된 데이터를 전달해줄 것이고
  //     60초가 지나면 다시 findProductList 함수를 호출하여 데이터를 전달하게 된다.
  // revalidate: 60, // 60초 기준
});

export const metadata = {
  title: "Home",
};

// Prism에게 타입을 알려달라고 요청할 수 있다. :: Prisma.PromiseReturnType<typeof DB함수명>
export type PrismaType = Prisma.PromiseReturnType<typeof findProductList>;

// main func
export default async function Product() {
  // const initProducts = await findProductListInit(); // 기존소스
  // [1] DB 조회를 NextJS Cache에게 위임했다.
  const initProducts = await getCachedProducts(0);

  // [5] 캐시 데이터를 갱신하는 함수 :: 예제확인할거면 주석해제할 것
  const revalidate = async () => {
    "use server";
    revalidatePath("/products");
  };

  return (
    <div>
      <Link href={`/home/recent`}>recent products</Link>

      <ProductLists initProducts={initProducts} />

      {/* revalidatePath 예제를 위한 form :: 예제확인할거면 주석해제할 것. */}
      <form action={revalidate}>
        <button>Revalidate</button>
      </form>
      <Link
        href="/products/add"
        className={`${clsx(
          "bg-orange-500 rounded-full size-16 ",
          "flex justify-center items-center",
          "fixed bottom-24 right-8 text-white",
          "transition-transform hover:bg-orange-400"
        )}`}
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
