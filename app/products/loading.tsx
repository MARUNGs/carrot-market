import { PhotoIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export default function ProductDetailLoading() {
  return (
    <div className="animate-pulse p-5 flex flex-col gap-5">
      <div
        className={`${clsx(
          "aspect-square rounded-md",
          "border-neutral-700 border-4 border-dashed",
          "flex items-center justify-center",
          "text-neutral-700"
        )}`}
      >
        <PhotoIcon className="h-28" />
      </div>

      <div className="flex gap-2 items-center ">
        <div className="size-14 rounded-full bg-neutral-700" />

        <div className="flex flex-col gap-1">
          <div className="h-5 w-40 bg-neutral-700 rounded-md" />
          <div className="h-5 w-20 bg-neutral-700 rounded-md" />
        </div>
      </div>
      <div className="h-5 w-80 bg-neutral-700 rounded-md" />
    </div>
  );
}