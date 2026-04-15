import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CategoryCard } from "@/components/CategoryCard";
import { useEffect, useState } from "react";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

export const Route = createFileRoute("/categorias")({
  component: CategoriasPage,
  head: () => ({
    meta: [
      { title: "Categorias - BellaCosméticos" },
      { name: "description", content: "Navegue por categorias de cosméticos." },
    ],
  }),
});

function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase.from("categories").select("*").order("sort_order").then(({ data }) => data && setCategories(data || []));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Categorias</h1>
          <p className="mt-1 text-muted-foreground">Encontre produtos por categoria</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <CategoryCard key={c.id} {...c} />
            ))}
          </div>
          {categories.length === 0 && (
            <p className="mt-20 text-center text-muted-foreground">Nenhuma categoria cadastrada ainda.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
