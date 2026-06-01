import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const images = [hero1, hero2, hero3];

export function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background gallery */}
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={images[index]}
            alt="Galeria de produtos"
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Beleza & Bem-estar
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-foreground drop-shadow-md md:text-6xl">
              Sua beleza merece o <span className="text-primary">melhor</span>
            </h1>
            <p className="mt-6 text-lg text-foreground/90 drop-shadow">
              Encontre os melhores produtos de Natura, O Boticário e muito mais.
              Entrega rápida e preços especiais.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="px-8">
                <Link to="/produtos">
                  Ver Produtos <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-background/70 px-8 backdrop-blur">
                <Link to="/categorias">Categorias</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Imagem ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-8 bg-primary" : "w-2 bg-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
