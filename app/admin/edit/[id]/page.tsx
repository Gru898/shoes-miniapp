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
  const [newSize, setNewSize] = useState("");
  const [newStock, setNewStock] = useState("");
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

  async function deleteProduct() {
    if (!confirm("Удалить товар полностью?")) return;

    await supabase.from("products").delete().eq("id", productId);

    alert("Товар удалён ✅");
    router.push("/admin");
  }

  // ---------- Размеры ----------

  async function addSize() {
    if (!newSize || !newStock) return;

    await supabase.from("product_sizes").insert([
      {
        product_id: productId,
        size: Number(newSize),
        stock: Number(newStock),
      },
    ]);

    setNewSize("");
    setNewStock("");
    fetchAll();
  }

  async function updateSize(sizeId: number, stock: number) {
    await supabase
      .from("product_sizes")
      .update({ stock })
      .eq("id", sizeId);

    fetchAll();
  }

  async function deleteSize(sizeId: number) {
    await supabase
      .from("product_sizes")
      .delete()
      .eq("id", sizeId);

    fetchAll();
  }

  // ---------- Фото ----------

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

        {/* Основные данные */}
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

          <button
            onClick={deleteProduct}
            className="w-full bg-red-600 text-white py-2 rounded"
          >
            Удалить товар
          </button>

        </div>

        {/* Размеры */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="font-medium">Размеры</h2>

          {sizes.map((s) => (
            <div key={s.id} className="flex justify-between items-center">
              <span>Размер {s.size}</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={s.stock}
                  onChange={(e) =>
                    updateSize(s.id, Number(e.target.value))
                  }
                  className="w-20 border p-1 rounded"
                />
                <button
                  onClick={() => deleteSize(s.id)}
                  className="text-red-600 text-sm"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}

          <div className="flex gap-2 pt-4">
            <input
              type="number"
              placeholder="Размер"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              className="border p-2 rounded w-1/2"
            />
            <input
              type="number"
              placeholder="Количество"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              className="border p-2 rounded w-1/2"
            />
            <button
              onClick={addSize}
              className="bg-gray-200 px-3 rounded"
            >
              +
            </button>
          </div>
        </div>

        {/* Фото */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="font-medium">Фото</h2>

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