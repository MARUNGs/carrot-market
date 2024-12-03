/** 클라이언트에서도 사용할 수 있도록 분리함 */

import { z } from "zod";

export const productSchema = z.object({
  photo: z.string({
    required_error: "사진을 등록해주세요.",
  }),
  title: z.string({
    required_error: "상품명을 입력해주세요.",
  }),
  description: z
    .string({
      required_error: "상품설명을 입력해주세요.",
    })
    .min(10),
  price: z.coerce.number({
    required_error: "가격을 입력해주세요.",
  }),
});

// infer: schema로부터 TS에서 쓸 수 있는 타입을 가져온다.
export type ProductType = z.infer<typeof productSchema>;
