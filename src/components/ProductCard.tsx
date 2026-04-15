import { Link } from "@tanstack/react-router";
import { ShoppingBag, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { addToCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number | null;
  image_url: string | null;
  brand?: string | null;
  free_shipping?: boolean | null;
  is_promotion?: boolean | null;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  original_price,
  image_url,
  brand,
  free_shipping,
  is_promotion,
}: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, price, image_url, free_shipping: free_shipping ?? false });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to="/produto/$slug"
        params={{ slug }}
        className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
      >
        <div className="relative aspect-square overflow-hidden bg-secondary/50">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ShoppingBag className="h-12 w-12" />
            </div>
          )}
          {is_promotion && (
            <span className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground">
              Promoção
            </span>
          )}
          {free_shipping && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-success px-3 py-1 text-xs font-semibold text-success-foreground">
              <Truck className="h-3 w-3" /> Frete grátis
            </span>
          )}
        </div>
        <div className="p-4">
          {brand && (
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {brand}
            </span>
          )}
          <h3 className="mt-1 line-clamp-2 text-sm font-medium text-card-foreground">{name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              R$ {price.toFixed(2).replace(".", ",")}
            </span>
            {original_price && original_price > price && (
              <span className="text-sm text-muted-foreground line-through">
                R$ {original_price.toFixed(2).replace(".", ",")}
              </span>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="mt-3 w-full"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}
