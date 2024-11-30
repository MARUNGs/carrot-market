// /(tabs)/layout.tsx를 사용하지 않을 것이기 때문에 별도로 라우팅작업을 하고 있다.

async function getProduct() {
  await new Promise((resolve) => setTimeout(resolve, 6000));
}

export default async function ProductDetail({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct();
  console.log(product);
  return <span>detail {id}</span>;
}
