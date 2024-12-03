"use server";

/**
 * 상품 등록
 * @param formData
 */
export async function uploadProduct(formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  console.log(data);
}
