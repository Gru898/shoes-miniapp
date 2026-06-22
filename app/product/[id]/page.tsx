"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);

  const product = products.find((p) => p.id === productId);

  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow">
          Товар не найден
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
    });

    router.push("/cart");
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Верхняя плашка */}
      <header className="sticky top-0 z-50 bg-black text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-4 text-center text-xl font-semibold tracking-wide">
          НАЗВАНИЕ МАГАЗИНА
        </div>
      </header>

      <section className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow p-6">
          {/* Фото */}
          <div className="h-72 bg-gray-200 rounded-xl mb-6"></div>

          {/* Название */}
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

          {/* Бренд */}
          <p className="text-gray-500 mb-1">
            Бренд: {product.brand}
          </p>

          {/* Материал */}
          <p className="text-gray-500 mb-4">
            Материал: {product.material}
          </p>

          {/* Цена */}
          <p className="text-xl font-semibold mb-6">
            {product.price.toLocaleString()} ₽
          </p>

          {/* Размеры */}
          <div className="mb-6">
            <h2 className="font-medium mb-2">
              Выберите размер:
            </h2>

            <div className="flex flex-wrap gap-3">
              {product.sizes.map((item) => (
                <button
                  key={item.size}
                  disabled={item.stock === 0}
                  onClick={() => setSelectedSize(item.size)}
                  className={`px-4 py-2 rounded-xl border transition
                    ${
                      selectedSize === item.size
                        ? "bg-black text-white"
                        : "bg-white"
                    }
                    ${
                      item.stock === 0
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-200"
                    }
                  `}
                >
                  {item.size}
                </button>
              ))}
            </div>
          </div>

          {/* Описание */}
          <div className="mb-6">
            <h2 className="font-medium mb-2">
              Описание:
            </h2>
            <p className="text-gray-700">
              {product.description}
            </p>
          </div>

          {/* Кнопка */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            Добавить в заказ
          </button>
        </div>
      </section>
    </main>
  );
}