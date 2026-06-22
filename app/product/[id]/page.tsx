import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import ProductClient from "@/components/ProductClient";

export const revalidate = 60;

export default async function ProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const productId = Number(params.id);

  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*),
      product_images (*)
    `)
    .eq("id", productId)
    .single();

  if (!product) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="p-6">Товар не найден</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />
      <ProductClient product={product} />
    </main>
  );
}