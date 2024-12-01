import { IProduct } from "@/app/types/ParamsInterface";
import { formatToWon, formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function ProductList({ ...props }: IProduct) {
  console.log(props.photo);
  return (
    <Link className="flex gap-5" href={`/products/${props.id}`}>
      <div className="relative size-28 rounded-md overflow-hidden">
        {/* Image는 width, height를 기본적으로 적용해줘야 NextJS가 옵티마이징 처리해준다. */}
        {/* 간혹 width, height를 모를 경우가 있다. 그럴땐 fill 속성을 사용할 것. (부모 크기만큼 size를 갖는다.)*/}
        <Image
          width={200}
          height={200}
          src={`/images/${props.photo}`}
          alt={props.title}
          className="object-cover"
          // quality={100} // 이미지 선명도
        />
      </div>

      <div className="flex flex-col gap-1 *:text-white">
        <span className="text-lg">{props.title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(props.created_at.toString())}
        </span>
        <span className="text-lg font-semibold">
          {formatToWon(props.price)}원
        </span>
      </div>
    </Link>
  );
}
