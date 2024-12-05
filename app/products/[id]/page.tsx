// /(tabs)/layout.tsx를 사용하지 않을 것이기 때문에 별도로 라우팅작업을 하고 있다.
import { IParams } from "@/app/types/ParamsInterface";
import {
  findProduct,
  findProductList,
  getProdictTitle,
  // removeProduct
} from "@/lib/db";
// import getSession from "@/lib/session";
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
 * 20241205 수정. dynamic -> static 페이지로 변경하기 위한 소스 변경
 * @param id
 * @returns
 */
async function getIsOwner(id: number): Promise<boolean> {
  console.log(id);
  // const session = await getSession(); // session이 있으면 static이 될 수 없으므로 주석처리함.
  // if (session.id) return session.id === id;
  return false;
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

/**
 * dynamicParams = true :: 미리 생성되지 않은 페이지들이 dynamic 페이지들로 간주된다.
 *  ㄴ dynamic 페이지들은 render되며 DB는 호출된다.
 * dynamicParams = false :: 미리 생성되지 않은 페이지들은 notFound 오류를 반환한다.
 *  ㄴ 즉, 오직 build 할 때 미리 생성된 페이지들만 찾을 수 있다.
 */
export const dynamicParams = true;

/**
 * dynamic 페이지를 static 페이지로 변경하는 기능
 * "이 페이지는 이런 종류의 parameter들을 받을 수 있어. 이것들이 가능한 것들이야."
 * @returns array
 */
export async function generateStaticParams() {
  const { data } = await findProductList(0);

  // params에 대한 정보를 반환해야 함. string 자료형으로 전달받았으므로 동일한 자료형으로 리턴할 것.
  const result = data.map(({ id }) => ({ id: id.toString() }));
  return result; // must have toreturn array
}
