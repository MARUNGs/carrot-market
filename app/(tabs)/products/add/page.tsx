"use client";
import FormButton from "@/components/Button";
import Input from "@/components/Input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useState } from "react";
import { uploadProduct } from "./actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductType } from "./schema";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  // useForm 리턴값 :: {name, onChange (), onBlur (), ref ()}
  const {
    register,
    handleSubmit,
    setValue, // form 데이터를 수동설정할 수 있음.
    setError,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  /**
   * form의 action을 가로채서 처리
   * 이 때, useForm의 handleSubmit을 사용하여 처리하게 되고
   * 파라미터는 prevState, formData가 아닌,
   * 유효성 검증을 마치고 반환된 데이터가 들어오게 된다.
   */
  const onSubmit = handleSubmit(async (data: ProductType) => {
    // const photo = formData.get("photo"); // 파일 업로드(cloudflare - 근데 난 사용하지 않음, ./public/images에 저장됨)
    if (!photo) return;

    /*
    // formData의 photo를 교체(File -> string)
      이 과정에서 CloudFlare를 사용해서 업로드된 파일의 URL을 formData에 세팅하는 작업이 있었다.
      근데 난 사용하지 않음. ;;
    */

    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("title", data.title);
    formData.append("price", data.price + "");
    formData.append("description", data.description);

    const errors = await uploadProduct(formData); // call uploadProduct action

    // 수동으로 에러 설정이 가능하다.
    if (errors) {
      // setError();
    }
  });

  /**
   * form의 action을 가로채서 처리
   */
  async function onValid() {
    await onSubmit();
  }

  // const [state, dispatch] = useFormState(interceptAction, null);

  // 이미지 미리보기
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;

    // 파일이 없으면 리턴
    if (!files) return;

    const file = files[0];

    // 이미지를 업로드했는지 확인
    if (!file.type.startsWith("image/")) return;

    // 파일 사이즈 확인 (최대 4MB)
    const maxSize = 4 * (1024 * 1024);
    if (maxSize < file.size) return;

    // 업로드파일 URL을 생성해줌. 업로드한 파일의 메모리에 우리의 브라우저가 access할 수 있게 되어서 URL 호출이 가능해짐.
    // 즉, 파일이 브라우저의 메모리에 업로드되었고 페이지를 새로고침할때까지 사용할 수 있다.
    setPreview(URL.createObjectURL(file));
    setPhoto(file);
    setValue("photo", `./public/images/${file.name}`); // 원래는 CloudFlare에서 제공되는 URL을 삽입해야 함.
  };

  return (
    <div>
      <form action={onValid} className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          className={`${clsx(
            "border-2 aspect-square",
            "flex items-center justify-center flex-col",
            "text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer",
            "bg-center bg-cover"
          )}`}
          // 이미지 미리보기
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {/* <span className="text-red-500">{state?.photo}</span> */}
                <span className="text-red-500">{errors.photo?.message}</span>
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
        />

        <Input
          type="text"
          // name="title"
          required
          placeholder="제목"
          {...register("title")}
          // errors={state?.title}
          errors={[errors.title?.message ?? ""]}
        />
        <Input
          type="number"
          // name="price"
          required
          placeholder="가격"
          {...register("price")}
          // errors={state?.price}
          errors={[errors.price?.message ?? ""]}
        />
        <Input
          type="text"
          // name="description"
          required
          placeholder="설명"
          {...register("description")}
          // errors={state?.description}
          errors={[errors.description?.message ?? ""]}
        />
        <FormButton text="작성 완료" />
      </form>
    </div>
  );
}
