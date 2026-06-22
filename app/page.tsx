"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  brand: string;
  image_url: string | null;
};

type ProductImage = {
  product_id: number;
  image_url: string;
};

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data: productData } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    const { data: imageData } = await supabase
      .from("product_images")
      .select("*");

    const productsWithImages = productData?.map((product) => {
      const images = imageData?.filter(
        (img) => img.product_id === product.id
      );

      return {
        ...product,
        displayImage:
          images && images.length > 0
            ? images[0].image_url
            : product.image_url,
      };
    });

    setProducts(productsWithImages || []);
    setLoading(false);
  }

  return (
    <main className="min-h-screen">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-6">

        <h2 className="text-xl font-semibold mb-6">
          Каталог
        </h2>

        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition cursor-pointer">

                  {product.displayImage && (
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.displayImage}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <p className="text-xs text-gray-500 uppercase">
                      {product.brand}
                    </p>

                    <h3 className="font-medium text-sm mb-2">
                      {product.name}
                    </h3>

                    <p className="font-semibold">
                      {product.price.toLocaleString()} ₽
                    </p>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}

      </section>
    </main>
  );
}