import { createFileRoute, useSearch } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useEffect, useState } from "react";
import type { Database } from "@/integrations/supabase/types";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

export const Route = createFileRoute("/produtos")({
  component: ProdutosPage,
  validateSearch: (search: Record<string, unknown>) => ({
    categoria: (search.categoria as string) || "",
    busca: (search.busca as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Produtos - BellaCosméticos" },
      { name: "description", content: "Catálogo completo de cosméticos." },
    ],
  }),
});

function ProdutosPage() {
  const { categoria, busca } = Route.useSearch();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categoria);
  const [searchTerm, setSearchTerm] = useState(busca);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("categories").select("*").order("sort_order").then(({ data }) => data && setCategories(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    let query = supabase.from("products").select("*").order("created_at", { ascending: false });

    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) query = query.eq("category_id", cat.id);
    }

    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`);
    }

    query.then(({ data }) => {
      setProducts(data || []);
      setLoading(false);
    });
  }, [selectedCategory, searchTerm, categories]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Produtos</h1>
          <p className="mt-1 text-muted-foreground">Encontre o produto perfeito para você</p>

          {/* Filters */}
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  !selectedCategory ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                Todos
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === c.slug ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products grid */}
          {loading ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-border bg-card">
                  <div className="aspect-square bg-secondary/50" />
                  <div className="space-y-2 p-4">
                    <div className="h-3 w-16 rounded bg-secondary" />
                    <div className="h-4 w-3/4 rounded bg-secondary" />
                    <div className="h-5 w-20 rounded bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="mt-20 text-center">
              <p className="text-lg text-muted-foreground">Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
