import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { Database } from "@/integrations/supabase/types";

type Order = Database["public"]["Tables"]["orders"]["Row"];

export const Route = createFileRoute("/admin/dashboard/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => data && setOrders(data));
  }, []);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-primary/10 text-primary",
    delivered: "bg-success/10 text-success",
    cancelled: "bg-destructive/10 text-destructive",
  };

  const statusLabels: Record<string, string> = {
    pending: "Pendente",
    confirmed: "Confirmado",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Pedidos</h1>

      <div className="mt-6 space-y-3">
        {orders.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Nenhum pedido ainda.</p>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-card-foreground">{o.customer_name}</h3>
                  <p className="text-sm text-muted-foreground">{o.customer_email}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusColors[o.status] || "bg-secondary text-secondary-foreground"}`}>
                    {statusLabels[o.status] || o.status}
                  </span>
                  <p className="mt-1 font-bold text-foreground">R$ {o.total.toFixed(2).replace(".", ",")}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(o.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
