import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-accent/20 py-20 md:py-32">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-rose-gold/15 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Beleza & Bem-estar
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
              Sua beleza merece o <span className="text-primary">melhor</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Encontre os melhores produtos de Natura, O Boticário e muito mais.
              Entrega rápida e preços especiais.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="px-8">
                <Link to="/produtos">
                  Ver Produtos <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link to="/categorias">Categorias</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
