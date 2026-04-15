import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";

interface CategoryCardProps {
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
}

export function CategoryCard({ name, slug, description, image_url }: CategoryCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        to="/produtos"
        search={{ categoria: slug }}
        className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary/50">
          {image_url ? (
            <img src={image_url} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/20">
              <Tag className="h-10 w-10 text-primary/50" />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-card-foreground">{name}</h3>
          {description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>}
        </div>
      </Link>
    </motion.div>
  );
}
