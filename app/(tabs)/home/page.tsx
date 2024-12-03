import ProductLists from "@/components/product-list";
import { findProductList, findProductListInit } from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";

// Prism에게 타입을 알려달라고 요청할 수 있다. :: Prisma.PromiseReturnType<typeof DB함수명>
export type PrismaType = Prisma.PromiseReturnType<typeof findProductList>;

// main func
export default async function Product() {
  const initProducts = await findProductListInit();

  return (
    <div>
      <ProductLists initProducts={initProducts} />
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
