import { createFileRoute, Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Package, Tag, ShoppingCart, LogOut, Home, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboardLayout,
});

function AdminDashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate({ to: "/admin" });
      } else {
        setChecking(false);
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin" });
  };

  if (checking) return null;

  const navItems = [
    { to: "/admin/dashboard", label: "Visão Geral", icon: LayoutDashboard },
    { to: "/admin/dashboard/products", label: "Produtos", icon: Package },
    { to: "/admin/dashboard/categories", label: "Categorias", icon: Tag },
    { to: "/admin/dashboard/orders", label: "Pedidos", icon: ShoppingCart },
  ] as const;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-border bg-card md:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link to="/" className="font-display text-lg font-bold text-foreground">
            Bella<span className="text-primary">Admin</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to as any}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-border p-4">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Home className="h-4 w-4" /> Ver Loja
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:hidden">
          <Link to="/" className="font-display text-lg font-bold text-foreground">
            Bella<span className="text-primary">Admin</span>
          </Link>
          <div className="flex gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-lg p-2 ${
                  location.pathname === item.to ? "bg-primary/10 text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            ))}
            <button onClick={handleLogout} className="rounded-lg p-2 text-muted-foreground">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
