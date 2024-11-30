import { IResultProps } from "@/app/types/ParamsInterface";

/**
 * DB 데이터 객체형으로 전달
 */
export function DbResult(data: IResultProps) {
  const result = {
    success: Boolean(data) ? true : false,
    data: data,
  };

  return result;
}
