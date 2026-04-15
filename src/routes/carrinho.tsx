import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart, updateQuantity, removeFromCart } from "@/lib/cart-store";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/carrinho")({
  component: CartPage,
  head: () => ({
    meta: [{ title: "Carrinho - BellaCosméticos" }],
  }),
});

function CartPage() {
  const { items, total, count } = useCart();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Carrinho</h1>

          {items.length === 0 ? (
            <div className="mt-20 text-center">
              <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30" />
              <p className="mt-4 text-lg text-muted-foreground">Seu carrinho está vazio</p>
              <Button asChild className="mt-6">
                <Link to="/produtos">Ver Produtos</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mt-6 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
                    >
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/50">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="truncate text-sm font-medium text-card-foreground">{item.name}</h3>
                        <p className="mt-1 font-bold text-foreground">
                          R$ {item.price.toFixed(2).replace(".", ",")}
                        </p>
                        {item.free_shipping && (
                          <span className="text-xs text-success">Frete grátis</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground hover:bg-secondary"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground hover:bg-secondary"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Summary */}
              <div className="mt-8 rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{count} {count === 1 ? "item" : "itens"}</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-foreground">
                    R$ {total.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <Button asChild size="lg" className="mt-6 w-full">
                  <Link to="/checkout">
                    Finalizar Compra <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
