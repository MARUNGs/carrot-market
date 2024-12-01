import { IProduct } from "@/app/types/ParamsInterface";
import ProductList from "@/components/ProductList";
import { findProductList } from "@/lib/db";

// main func
export default async function Product() {
  const products = await findProductList();

  return (
    <div className="p-5 flex flex-col gap-5">
      {products.success &&
        products.data.map((product: IProduct) => (
          <ProductList key={product.id} {...product} />
        ))}
    </div>
  );
}
