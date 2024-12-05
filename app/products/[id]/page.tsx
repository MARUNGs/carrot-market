// /(tabs)/layout.tsx를 사용하지 않을 것이기 때문에 별도로 라우팅작업을 하고 있다.
import { IParams } from "@/app/types/ParamsInterface";
import { findProduct, removeProduct } from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

// paramater로 넘어온 id 값을 metadata에 넣어줌.
export async function generateMetadata({ params }: IParams) {
  const product = await findProduct(Number(params.id));
  return { title: `${product.data.title}` };
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
  const product = await findProduct(id);
  const isOwner = await getIsOwner(id);

  // 의도하지 않은 경로로 진입했다면 404 오류
  if (isNaN(id) || !product) {
    return notFound();
  }

  const {
    data: {
      id: productId,
      photo,
      price,
      title,
      description,
      // created_at,
      user: { avatar, name: username, id: findUserId },
    },
  } = product;

  // 제품 삭제
  async function deleteProduct() {
    "use server";
    await removeProduct(productId, findUserId); // 상품 삭제
    return redirect("/products");
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
          <form action={deleteProduct}>
            <button
              className={`${clsx(
                "bg-red-500 px-5 py-2.5",
                "rounded-md text-white font-semibold"
              )}`}
            >
              삭제
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
