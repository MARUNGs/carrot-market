"use client";
import { IProduct } from "@/app/types/ParamsInterface";
import { IProductListResult } from "@/app/types/ReturnInterface";
import ProductList from "./ProductList";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { getMoreProducts } from "@/app/(tabs)/products/server";
import { threadId } from "worker_threads";

interface IProps {
  initProducts: IProductListResult;
}

export default function ProductLists({ initProducts }: IProps) {
  const [products, setProducts] = useState(initProducts.data);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);

  // 무한스크롤 trigger 감지하기
  useEffect(() => {
    // trigger 엘리먼트가 화면에 있는 것을 감지하면 observe하는 것을 멈추고 DB에서 상품을 더 호출함
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        // 현재 감지하고 있는 엘리먼트
        const element = entries[0];

        // 엘리먼트가 화면에 보이면서 트리거가 존재하는 경우
        if (element.isIntersecting && trigger.current) {
          // observer를 잠시 멈추고 DB에서 현재 리스트 다음의 새로운 다음 상품리스트를 조회한다.
          observer.unobserve(trigger.current);
          setLoading(true);
          const { data: list } = await getMoreProducts(page + 1);

          // 데이터가 존재할때만 페이지 번호를 증가시킨다.
          if (list.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...list]);
            setLoading(false);
          } else {
            setLastPage(true);
          }
        }
      },
      {
        // observer가 트리거가 100% 표시될때 실행하고 싶을때 해당 속성을 이용한다.
        threshold: 1.0,
        // IntersectionObserver가 보고있는 컨테이너에 margin을 설정할 수 있다.
        rootMargin: "0px 0px -100px 0px",
      }
    );

    // 트리거가 있으면 observer 감지를 시작한다.
    if (trigger.current) {
      observer.observe(trigger.current);
    }

    // cleanup 수행(ProductLists 컴포넌트가 unmount될 때 호출된다.)
    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="p-5 flex flex-col gap-5">
      {initProducts.success &&
        products.map((product: IProduct) => (
          <ProductList key={product.id} {...product} />
        ))}

      {!lastPage ? (
        <span
          ref={trigger}
          style={{
            marginTop: `${(page + 1) * 300}vh`, // 실제 만들때 이렇게 구현 안함. 지금은 데이터가 없어서 임시로.
          }}
          className={`${clsx(
            "mb-96",
            "text-sm font-semibold",
            "bg-orange-500 w-fit mx-auto px-3 py-2",
            "rounded-md hover:opacity-90 active:scale-95"
          )}`}
        >
          {loading ? "Loading ..." : "Load more"}
        </span>
      ) : null}
    </div>
  );
}
