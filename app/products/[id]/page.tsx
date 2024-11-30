// /(tabs)/layout.tsx를 사용하지 않을 것이기 때문에 별도로 라우팅작업을 하고 있다.

async function getProduct() {
  await new Promise((resolve) => setTimeout(resolve, 6000));
}

interface IParams {
  params: { id: string };
}

export default async function ProductDetail({ params: { id } }: IParams) {
  const product = await getProduct();
  console.log(product);
  return <span>detail {id}</span>;
}
