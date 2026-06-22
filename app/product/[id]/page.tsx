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
};

type Size = {
  id: number;
  size: number;
  stock: number;
};

type Image = {
  id: number;
  image_url: string;
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const { data: productData } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    const { data: sizeData } = await supabase
      .from("product_sizes")
      .select("*")
      .eq("product_id", productId);

    const { data: imageData } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId);

    setProduct(productData);
    setSizes(sizeData || []);
    setImages(imageData || []);

    if (imageData && imageData.length > 0) {
      setSelectedImage(imageData[0].image_url);
    }

    setLoading(false);
  }

  if (loading || !product) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="p-6">Загрузка...</div>
      </main>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize.size,
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

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">

          {/* Главное фото */}
          {selectedImage && (
            <div className="h-72 rounded-xl overflow-hidden">
              <img
                src={selectedImage}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Миниатюры */}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img) => (
                <img
                  key={img.id}
                  src={img.image_url}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                    selectedImage === img.image_url
                      ? "border-black"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>
          )}

          <h1 className="text-2xl font-bold">
            {product.name}
          </h1>

          <p className="text-gray-500">
            {product.brand}
          </p>

          <p className="text-xl font-semibold">
            {product.price.toLocaleString()} ₽
          </p>

          {/* Размеры */}
          <div>
            <h2 className="font-medium mb-2">
              Выберите размер:
            </h2>

            <div className="flex flex-wrap gap-3">
              {sizes.map((item) => (
                <button
                  key={item.id}
                  disabled={item.stock === 0}
                  onClick={() => setSelectedSize(item)}
                  className={`px-4 py-2 rounded-xl border transition
                    ${
                      selectedSize?.id === item.id
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

          <p className="text-gray-700">
            {product.description}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="w-full bg-black text-white py-3 rounded-xl font-medium disabled:opacity-50"
          >
            Добавить в заказ
          </button>

        </div>

      </section>
    </main>
  );
}