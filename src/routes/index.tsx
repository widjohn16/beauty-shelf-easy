import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { useEffect, useState } from "react";
import type { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "PJ Presentes & Variedades" },
      { name: "description", content: "Presentes, cosméticos e variedades. Natura, O Boticário e mais." },
    ],
  }),
});

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .limit(4)
      .then(({ data }) => data && setFeaturedProducts(data));

    supabase
      .from("products")
      .select("*")
      .eq("is_promotion", true)
      .limit(4)
      .then(({ data }) => data && setPromoProducts(data));

    supabase
      .from("categories")
      .select("*")
      .order("sort_order")
      .limit(6)
      .then(({ data }) => data && setCategories(data));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />

        {/* Featured products */}
        {featuredProducts.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-16">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Mais Vendidos
            </h2>
            <p className="mt-1 text-muted-foreground">Os produtos favoritos dos nossos clientes</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <section className="bg-secondary/20 py-16">
            <div className="mx-auto max-w-7xl px-4">
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Categorias
              </h2>
              <p className="mt-1 text-muted-foreground">Navegue por categoria</p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((c) => (
                  <CategoryCard key={c.id} {...c} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Promo products */}
        {promoProducts.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-16">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              🔥 Promoções
            </h2>
            <p className="mt-1 text-muted-foreground">Aproveite os melhores preços</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {promoProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {featuredProducts.length === 0 && categories.length === 0 && promoProducts.length === 0 && (
          <section className="mx-auto max-w-7xl px-4 py-20 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Bem-vindo à BellaCosméticos!
            </h2>
            <p className="mt-2 text-muted-foreground">
              Acesse o <a href="/admin-login" className="text-primary underline">painel administrativo</a> para cadastrar seus primeiros produtos e categorias.
            </p>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
