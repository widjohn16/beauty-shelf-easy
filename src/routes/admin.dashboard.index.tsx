import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Package, Tag, ShoppingCart } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/dashboard/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("categories").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
    ]).then(([p, c, o]) => {
      setStats({
        products: p.count || 0,
        categories: c.count || 0,
        orders: o.count || 0,
      });
    });
  }, []);

  const cards = [
    { label: "Produtos", value: stats.products, icon: Package, color: "text-primary" },
    { label: "Categorias", value: stats.categories, icon: Tag, color: "text-success" },
    { label: "Pedidos", value: stats.orders, icon: ShoppingCart, color: "text-rose-gold" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Visão Geral</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <c.icon className={`h-8 w-8 ${c.color}`} />
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="text-2xl font-bold text-card-foreground">{c.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
