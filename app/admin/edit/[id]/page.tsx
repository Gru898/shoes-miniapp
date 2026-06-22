"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";

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

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);
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
    setLoading(false);
  }

  async function uploadImage() {
    if (!newImage) return;

    const fileExt = newImage.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    await supabase.storage
      .from("product-images")
      .upload(fileName, newImage);

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    await supabase.from("product_images").insert([
      {
        product_id: productId,
        image_url: data.publicUrl,
      },
    ]);

    setNewImage(null);
    fetchAll();
  }

  async function deleteImage(imageId: number) {
    await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId);

    fetchAll();
  }

  async function updateProduct() {
    if (!product) return;

    await supabase
      .from("products")
      .update({
        name: product.name,
        price: product.price,
        brand: product.brand,
        material: product.material,
        description: product.description,
      })
      .eq("id", productId);

    alert("Сохранено ✅");
  }

  if (loading || !product) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="p-6">Загрузка...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />

      <section className="max-w-3xl mx-auto p-4 space-y-6">

        <h1 className="text-xl font-semibold">
          Редактирование товара
        </h1>

        <div className="bg-white rounded-2xl shadow p-6 space-y-4">

          <input
            value={product.name}
            onChange={(e) =>
              setProduct({ ...product, name: e.target.value })
            }
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: Number(e.target.value) })
            }
            className="w-full border p-2 rounded"
          />

          <textarea
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            className="w-full border p-2 rounded"
          />

          <button
            onClick={updateProduct}
            className="w-full bg-black text-white py-2 rounded"
          >
            Сохранить
          </button>

        </div>

        {/* Фото */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">

          <h2 className="font-medium">Фото товара</h2>

          <div className="grid grid-cols-3 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative">
                <img
                  src={img.image_url}
                  className="w-full h-28 object-cover rounded"
                />
                <button
                  onClick={() => deleteImage(img.id)}
                  className="absolute top-1 right-1 bg-black text-white text-xs px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <input
            type="file"
            onChange={(e) =>
              setNewImage(e.target.files ? e.target.files[0] : null)
            }
          />

          <button
            onClick={uploadImage}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Добавить фото
          </button>

        </div>

        <button
          onClick={() => router.push("/admin")}
          className="text-sm text-gray-500 hover:underline"
        >
          ← Назад
        </button>

      </section>
    </main>
  );
}