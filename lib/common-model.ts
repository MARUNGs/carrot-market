import { IProduct, IResultProps } from "@/app/types/ParamsInterface";
import {
  IProductListResult,
  IProductResult,
} from "@/app/types/ReturnInterface";

/**
 * DB 데이터 객체형으로 전달
 */
export function UserResult(data: IResultProps) {
  const result = { success: Boolean(data) ? true : false, data };
  return result;
}

/**
 * 상품리스트 결과값
 * @param data
 * @returns
 */
export function ProductListResult(data: IProduct[]): IProductListResult {
  const result = { success: Boolean(data) ? true : false, data };
  return result;
}

export function ProductResult(data: IProduct): IProductResult {
  const result = { success: Boolean(data) ? true : false, data };
  return result;
}
