import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { addToCart } from "@/lib/cart-store";
import { ShoppingBag, Truck, ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { Database } from "@/integrations/supabase/types";
import { motion } from "framer-motion";

type Product = Database["public"]["Tables"]["products"]["Row"];

export const Route = createFileRoute("/produto/$slug")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data }) => {
        setProduct(data);
        setLoading(false);
      });
  }, [slug]);

  const handleAdd = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      free_shipping: product.free_shipping ?? false,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="animate-pulse">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="aspect-square rounded-xl bg-secondary" />
                <div className="space-y-4">
                  <div className="h-4 w-24 rounded bg-secondary" />
                  <div className="h-8 w-3/4 rounded bg-secondary" />
                  <div className="h-20 rounded bg-secondary" />
                  <div className="h-10 w-32 rounded bg-secondary" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">Produto não encontrado</h1>
            <Link to="/produtos" className="mt-4 inline-block text-primary underline">
              Voltar aos produtos
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Link to="/produtos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Voltar aos produtos
          </Link>

          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="overflow-hidden rounded-xl border border-border bg-secondary/30"
            >
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="aspect-square w-full object-cover" />
              ) : (
                <div className="flex aspect-square items-center justify-center">
                  <Package className="h-20 w-20 text-muted-foreground/30" />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col justify-center"
            >
              {product.brand && (
                <span className="text-xs font-medium uppercase tracking-widest text-primary">{product.brand}</span>
              )}
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">{product.name}</h1>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-3xl font-bold text-foreground">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    R$ {product.original_price.toFixed(2).replace(".", ",")}
                  </span>
                )}
              </div>

              {product.free_shipping && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success">
                  <Truck className="h-4 w-4" /> Frete grátis
                </div>
              )}

              {product.is_kit && (
                <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                  <Package className="h-4 w-4" /> Kit
                </div>
              )}

              {product.description && (
                <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>
              )}

              <div className="mt-8">
                <Button onClick={handleAdd} size="lg" className="px-10">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  {added ? "Adicionado! ✓" : "Adicionar ao Carrinho"}
                </Button>
              </div>

              {!product.in_stock && (
                <p className="mt-4 text-sm font-medium text-destructive">Produto indisponível</p>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
