"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";

type Product = {
  id: number;
  name: string;
  price: number;
  brand: string;
  material: string;
  description: string;
  image_url: string;
};

type Size = {
  id: number;
  size: number;
  stock: number;
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
    fetchSizes();
  }, []);

  async function fetchProduct() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    setProduct(data);
  }

  async function fetchSizes() {
    const { data } = await supabase
      .from("product_sizes")
      .select("*")
      .eq("product_id", productId);

    setSizes(data || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="p-6">Загрузка...</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="p-6">Товар не найден</div>
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
    <main className="min-h-screen">
      <Header />

      <section className="max-w-4xl mx-auto p-4">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4"
        >
          <ArrowLeft size={18} />
          Назад
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <div className="h-72 rounded-xl overflow-hidden mb-6">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-2xl font-bold mb-2">
            {product.name}
          </h1>

          <p className="text-gray-500 mb-1">
            Бренд: {product.brand}
          </p>

          <p className="text-gray-500 mb-4">
            Материал: {product.material}
          </p>

          <p className="text-xl font-semibold mb-6">
            {product.price.toLocaleString()} ₽
          </p>

          {/* Размеры */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <h2 className="font-medium mb-2">
                Выберите размер:
              </h2>

              <div className="flex flex-wrap gap-3">
                {sizes.map((item) => (
                  <button
                    key={item.id}
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
          )}

          <div className="mb-6">
            <h2 className="font-medium mb-2">
              Описание:
            </h2>
            <p className="text-gray-700">
              {product.description}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            Добавить в заказ
          </button>

        </div>
      </section>
    </main>
  );
}