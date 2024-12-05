// /(tabs)/layout.tsx를 사용하지 않을 것이기 때문에 별도로 라우팅작업을 하고 있다.
import { IParams } from "@/app/types/ParamsInterface";
import {
  findProduct,
  getProdictTitle,
  // removeProduct
} from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import {
  notFound,
  // redirect
} from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

// [1] NextJS Cache에서 관리 :: 상품 상세정보
const getCachedProduct = nextCache(findProduct, ["product-detail"], {
  tags: ["product-detail", "commonCache"],
});

// [2] NextJS Cache에서 관리 :: 헤더 타이틀정보
const getCachedProductTitle = nextCache(
  getProdictTitle, // 이것과 같은 의미임. :: (id: number) => getProducttitle(id)
  ["product-title"],
  {
    // 여러 cache들은 동일한 tags를 공유할 수 있다.
    tags: ["product-title", "commonCache"],
  }
);

// paramater로 넘어온 id 값을 metadata에 넣어줌.
export async function generateMetadata({ params }: IParams) {
  const product = await getCachedProductTitle(Number(params.id));
  return { title: `${product.title}` };
}

/**
 * 현재 사용자가 상품 게시글 작성자인지 확인하기 위한 확인
 * @param id
 * @returns
 */
async function getIsOwner(id: number): Promise<boolean> {
  const session = await getSession();
  if (session.id) {
    return session.id === id;
  } else return false;
}

export default async function ProductDetail({ params }: IParams) {
  const id = Number(params.id); // Number || NaN
  // const product = await findProduct(id); // 기존소스
  const product = await getCachedProduct(id);
  const isOwner = await getIsOwner(id);

  // 의도하지 않은 경로로 진입했다면 404 오류
  if (isNaN(id) || !product) {
    return notFound();
  }

  const {
    data: {
      // id: productId,
      photo,
      price,
      title,
      description,
      // created_at,
      user: {
        avatar,
        name: username,
        // id: findUserId
      },
    },
  } = product;

  // 제품 삭제
  // async function deleteProduct() {
  //   "use server";
  //   await removeProduct(productId, findUserId); // 상품 삭제
  //   return redirect("/products");
  // }

  // revalidateTags 예제를 위한 함수 :: 예제확인할거면 주석해제할 것.
  async function revalidate() {
    // 비동기 함수 선언 필요
    "use server";
    // 같은 페이지에 있음에도 불구하고 헤더 타이틀만 새롭게 갱신되고 상품 상세정보는 그대로 있음.
    revalidateTag("product-title");
    // 만약, product-detail, product-title 둘다 갱신을 원한다면?
    // revalidateTag("commonCache");
  }

  return (
    <div>
      <div className="relative aspect-square">
        <Image
          className="object-cover" // 이미지 변형없이 비율 그대로 보여줌
          fill
          src={`/images/${photo}`}
          alt={title}
        />
      </div>

      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 rounded-full overflow-hidden">
          {avatar !== null ? (
            <Image src={avatar} alt={username} width={40} height={40} />
          ) : (
            <UserIcon />
          )}
        </div>

        <div>
          <h3>{username}</h3>
        </div>
      </div>

      <div className="p-5">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p>{description}</p>
      </div>

      <div
        className={`${clsx(
          "fixed w-full bottom-0 left-0",
          "p-5 pb-10 bg-neutral-800",
          "flex justify-between items-center"
        )}`}
      >
        <span className="font-semibold text-lg">{formatToWon(price)}원</span>
        {!isOwner ? (
          // <form action={deleteProduct}>
          // revalidateTags 예제를 위한 form :: 예제확인할거면 주석해제할 것.
          <form action={revalidate}>
            <button
              className={`${clsx(
                "bg-red-500 px-5 py-2.5",
                "rounded-md text-white font-semibold"
              )}`}
            >
              {/* revalidateTags 예제를 위한 form :: 예제확인할거면 주석해제할 것. */}
              Revalidate title cache
              {/* 삭제 */}
            </button>
          </form>
        ) : null}
        <Link
          className={`${clsx(
            "bg-orange-500 px-5 py-2.5",
            "rounded-md text-white font-semibold"
          )}`}
          href={`/chat`}
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
}
