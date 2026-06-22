import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
};

export default function ProductCard({ product }: { product: Product }) {
return (
  <Link href={`/product/${product.id}`}>
    <div className="bg-white rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-4 cursor-pointer">
      <div className="h-44 bg-gray-200 rounded-xl mb-4"></div>

      <h3 className="font-medium text-lg">{product.name}</h3>

      <p className="text-gray-900 font-semibold mt-2">
        {product.price.toLocaleString()} ₽
      </p>
    </div>
  </Link>
);
}