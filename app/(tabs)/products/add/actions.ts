"use server";
import { z } from "zod";
import fs from "fs/promises"; // file system async-await 버전
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const formSchema = z.object({
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

interface UploadProductState {
  photo?: string[];
  title?: string[];
  price?: string[];
  description?: string[];

  success?: boolean;
}

/**
 * 상품 등록
 * @param formData
 */
export async function uploadProduct(_: UploadProductState, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
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

    data.photo = `/${data.photo.name}`;
  }

  const result = formSchema.safeParse(data);
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
