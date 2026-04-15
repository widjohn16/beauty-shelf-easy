import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

export const Route = createFileRoute("/admin/dashboard/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", sort_order: "0" });
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    supabase.from("categories").select("*").order("sort_order").then(({ data }) => data && setCategories(data));
  };

  useEffect(() => { loadData(); }, []);

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleEdit = (c: Category) => {
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      sort_order: String(c.sort_order || 0),
    });
    setEditing(c.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza?")) return;
    await supabase.from("categories").delete().eq("id", id);
    loadData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      description: form.description || null,
      sort_order: parseInt(form.sort_order) || 0,
    };

    if (editing) {
      await supabase.from("categories").update(data).eq("id", editing);
    } else {
      await supabase.from("categories").insert(data);
    }

    setForm({ name: "", slug: "", description: "", sort_order: "0" });
    setEditing(null);
    setShowForm(false);
    setLoading(false);
    loadData();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Categorias</h1>
        <Button onClick={() => { setForm({ name: "", slug: "", description: "", sort_order: "0" }); setEditing(null); setShowForm(!showForm); }}>
          {showForm ? <><X className="mr-2 h-4 w-4" /> Fechar</> : <><Plus className="mr-2 h-4 w-4" /> Nova Categoria</>}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Nome *</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div>
              <Label>Ordem</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button type="submit" disabled={loading}>
              <Check className="mr-2 h-4 w-4" /> {loading ? "Salvando..." : editing ? "Atualizar" : "Criar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>Cancelar</Button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {categories.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Nenhuma categoria cadastrada.</p>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <h3 className="font-medium text-card-foreground">{c.name}</h3>
                <p className="text-sm text-muted-foreground">{c.slug}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(c)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(c.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
