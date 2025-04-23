import { products } from "../../../datastore/Products";
import ProductClient from "./productClient";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({ params }: Params) {
  // Await the params object to get the id
  const { id } = await params;
  const product = products.find((p) => String(p.id) === id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductClient product={product} />;
}