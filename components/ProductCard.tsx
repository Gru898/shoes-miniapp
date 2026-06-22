import Link from "next/link";
import { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fadeIn">
        
        {/* Фото */}
        <div className="aspect-square bg-gray-200 overflow-hidden">
          <div className="w-full h-full bg-gray-300 group-hover:scale-105 transition-transform duration-500" />
        </div>

        {/* Информация */}
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
            {product.brand}
          </p>

          <h3 className="font-medium text-sm mb-2 line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>

          <p className="text-base font-semibold">
            {product.price.toLocaleString()} ₽
          </p>
        </div>
      </div>
    </Link>
  );
}