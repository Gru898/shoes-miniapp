import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import ProductsClient from "@/components/ProductsClient";

export const revalidate = 60;

export default async function Home() {
  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      brand,
      image_url,
      product_images (
        image_url
      )
    `)
    .order("id", { ascending: false });

  const preparedProducts = products?.map((product) => {
    const previewImage =
      product.product_images && product.product_images.length > 0
        ? product.product_images[0].image_url
        : product.image_url;

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      brand: product.brand,
      previewImage,
    };
  });

  return (
    <main className="min-h-screen">
      <Header />
      <ProductsClient products={preparedProducts || []} />
    </main>
  );
}