"use client";
import { IProduct } from "@/app/types/ParamsInterface";
import { IProductListResult } from "@/app/types/ReturnInterface";
import ProductList from "./ProductList";
import { useState } from "react";
import clsx from "clsx";
import { getMoreProducts } from "@/app/(tabs)/products/server";

interface IProps {
  initProducts: IProductListResult;
}

export default function ProductLists({ initProducts }: IProps) {
  const [products, setProducts] = useState(initProducts.data);
  const [loading, setLoading] = useState(false);
  const onLoadMoreClick = async () => {
    setLoading(true);
    const { data: list } = await getMoreProducts(2);
    setProducts((prev) => [...prev, ...list]);
    setLoading(false);
  };

  return (
    <div className="p-5 flex flex-col gap-5">
      {initProducts.success &&
        products.map((product: IProduct) => (
          <ProductList key={product.id} {...product} />
        ))}

      <button
        onClick={onLoadMoreClick}
        disabled={loading}
        className={`${clsx(
          "text-sm font-semibold",
          "bg-orange-500 w-fit mx-auto px-3 py-2",
          "rounded-md hover:opacity-90 active:scale-95"
        )}`}
      >
        {loading ? "Loading ..." : "Load more"}
      </button>
    </div>
  );
}
