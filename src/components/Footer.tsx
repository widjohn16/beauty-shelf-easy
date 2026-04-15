import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              Bella<span className="text-primary">Cosméticos</span>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Os melhores produtos de beleza das marcas que você ama.
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
            <p className="text-sm text-muted-foreground">contato@bellacosmeticos.com</p>
            <p className="text-sm text-muted-foreground">(11) 99999-9999</p>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} BellaCosméticos. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
