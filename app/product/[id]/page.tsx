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

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, []);

  async function fetchProduct() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error(error);
    } else {
      setProduct(data);
    }

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
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: 0, // пока без размеров из базы
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
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Добавить в заказ
          </button>

        </div>
      </section>
    </main>
  );
}