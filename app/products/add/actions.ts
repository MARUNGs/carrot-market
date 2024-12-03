"use server";

import fs from "fs/promises"; // xfile system async-await 버전
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { productSchema } from "./schema";

export interface UploadProductState {
  photo?: string[];
  title?: string[];
  price?: string[];
  description?: string[];

  success?: boolean;
}

/**
 * 상품 등록 :: React Hook Form에서 유효성검증을 가로채고 있어서 파라미터는 유효성검증이 완료된 formData만 들어오게 된다.
 * @param formData
 */
export async function uploadProduct(formData: FormData) {
  const data = {
    photo: formData.get("photo"), // string으로 넘어오지만 file 형식이므로 intecept 하여 처리해야함.
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  if (data.photo instanceof File) {
    // 사진의 데이터를 arrayBuffer로 변환
    const photoData = await data.photo.arrayBuffer();
    // 사진을 public 폴더에 저장(임시처리)
    await fs.appendFile(
      `./public/images/${data.photo.name}`,
      Buffer.from(photoData)
    );

    data.photo = `${data.photo.name}`;
  }

  const result = productSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten().fieldErrors;
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      // 둘중에 한 곳으로 이동
      redirect(`/products/${product.id}`);
      redirect("/products");
    }
  }
}
