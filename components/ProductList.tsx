import { IProduct } from "@/app/types/ParamsInterface";

export default function ProductList({ ...props }: IProduct) {
  console.log(props);
  return <div></div>;
}
