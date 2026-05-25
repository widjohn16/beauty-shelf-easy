import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              PJ <span className="text-primary">Presentes & Variedades</span>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Presentes, cosméticos e variedades para todas as ocasiões.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Navegação</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">Início</Link>
              <Link to="/produtos" className="text-sm text-muted-foreground hover:text-primary">Produtos</Link>
              <Link to="/categorias" className="text-sm text-muted-foreground hover:text-primary">Categorias</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Contato</h4>
            <a
              href="https://wa.me/5511967184446"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              WhatsApp: (11) 96718-4446
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} PJ Presentes & Variedades. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
