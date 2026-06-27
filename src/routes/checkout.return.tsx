import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id:
      typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: ReturnPage,
  head: () => ({ meta: [{ title: "Pedido confirmado" }] }),
});

function ReturnPage() {
  const { session_id } = Route.useSearch();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!session_id) return;
    let cancelled = false;
    const fetchOrder = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("stripe_session_id", session_id)
        .maybeSingle();
      if (!cancelled) setOrder(data);
    };
    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [session_id]);

  const isPaid = order?.status === "paid";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="max-w-md text-center">
          {isPaid ? (
            <>
              <CheckCircle className="mx-auto h-16 w-16 text-success" />
              <h1 className="mt-4 font-display text-3xl font-bold text-foreground">
                Pagamento Confirmado!
              </h1>
              <p className="mt-2 text-muted-foreground">
                Obrigado pela sua compra. Enviamos os detalhes para seu e-mail.
              </p>
            </>
          ) : (
            <>
              <Clock className="mx-auto h-16 w-16 text-primary" />
              <h1 className="mt-4 font-display text-3xl font-bold text-foreground">
                Pedido recebido
              </h1>
              <p className="mt-2 text-muted-foreground">
                {order?.status === "pending"
                  ? "Aguardando confirmação do pagamento (PIX pode levar alguns minutos)."
                  : "Processando seu pedido..."}
              </p>
            </>
          )}

          {order && (
            <div className="mt-6 rounded-xl border border-border bg-card p-4 text-left">
              <p className="text-sm text-muted-foreground">Número do pedido</p>
              <p className="font-mono text-sm font-semibold">{order.id}</p>
              <p className="mt-3 text-sm text-muted-foreground">Total</p>
              <p className="font-bold">
                R$ {Number(order.total).toFixed(2).replace(".", ",")}
              </p>
            </div>
          )}

          <Button asChild className="mt-8">
            <Link to="/">Voltar ao Início</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
