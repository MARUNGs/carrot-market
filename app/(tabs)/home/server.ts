"use server";

import { findProductList } from "@/lib/db";

/**
 * [상품페이지] 페이지네이션 기능
 * @param page
 * @returns
 */
export async function getMoreProducts(page: number) {
  return await findProductList(page);
}
