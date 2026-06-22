"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function ProductClient({ product }: any) {
  const router = useRouter();
  const { addToCart } = useCart();

  const images =
    product.product_images?.length > 0
      ? product.product_images.map((img: any) => img.image_url)
      : product.image_url
      ? [product.image_url]
      : [];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedSize, setSelectedSize] = useState<any>(null);

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
    <section className="max-w-4xl mx-auto p-4 space-y-6">

      {selectedImage && (
        <div className="h-72 rounded-xl overflow-hidden">
          <img
            src={selectedImage}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img: string, index: number) => (
            <img
              key={index}
              src={img}
              onClick={() => setSelectedImage(img)}
              className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                selectedImage === img
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

      <div>
        <h2 className="font-medium mb-2">
          Выберите размер:
        </h2>

        <div className="flex flex-wrap gap-3">
          {product.product_sizes?.map((size: any) => (
            <button
              key={size.id}
              disabled={size.stock === 0}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 rounded-xl border transition
                ${
                  selectedSize?.id === size.id
                    ? "bg-black text-white"
                    : "bg-white"
                }
                ${
                  size.stock === 0
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }
              `}
            >
              {size.size}
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

    </section>
  );
}