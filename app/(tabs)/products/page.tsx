import ProductLists from "@/components/product-list";
import { findProductList, findProductListInit } from "@/lib/db";
import { Prisma } from "@prisma/client";

// Prism에게 타입을 알려달라고 요청할 수 있다. :: Prisma.PromiseReturnType<typeof DB함수명>
export type PrismaType = Prisma.PromiseReturnType<typeof findProductList>;

// main func
export default async function Product() {
  const initProducts = await findProductListInit();

  return (
    <div>
      <ProductLists initProducts={initProducts} />
    </div>
  );
}
