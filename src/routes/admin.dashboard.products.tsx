import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, X, Check, Upload } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

export const Route = createFileRoute("/admin/dashboard/products")({
  component: AdminProducts,
});

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  original_price: "",
  brand: "",
  category_id: "",
  free_shipping: false,
  is_featured: false,
  is_promotion: false,
  is_kit: false,
  in_stock: true,
};

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    supabase.from("products").select("*").order("created_at", { ascending: false }).then(({ data }) => data && setProducts(data));
    supabase.from("categories").select("*").order("sort_order").then(({ data }) => data && setCategories(data));
  };

  useEffect(() => { loadData(); }, []);

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleEdit = (p: Product) => {
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description || "",
      price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : "",
      brand: p.brand || "",
      category_id: p.category_id || "",
      free_shipping: p.free_shipping ?? false,
      is_featured: p.is_featured ?? false,
      is_promotion: p.is_promotion ?? false,
      is_kit: p.is_kit ?? false,
      in_stock: p.in_stock ?? true,
    });
    setEditing(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    await supabase.from("products").delete().eq("id", id);
    loadData();
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(fileName, file);
    if (error) { console.error(error); return null; }
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let image_url: string | undefined;
    if (imageFile) {
      const url = await uploadImage(imageFile);
      if (url) image_url = url;
    }

    const productData = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      description: form.description || null,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      brand: form.brand || null,
      category_id: form.category_id || null,
      free_shipping: form.free_shipping,
      is_featured: form.is_featured,
      is_promotion: form.is_promotion,
      is_kit: form.is_kit,
      in_stock: form.in_stock,
      ...(image_url ? { image_url } : {}),
    };

    if (editing) {
      await supabase.from("products").update(productData).eq("id", editing);
    } else {
      await supabase.from("products").insert(productData);
    }

    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    setImageFile(null);
    setLoading(false);
    loadData();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Produtos</h1>
        <Button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(!showForm); }}>
          {showForm ? <><X className="mr-2 h-4 w-4" /> Fechar</> : <><Plus className="mr-2 h-4 w-4" /> Novo Produto</>}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">
            {editing ? "Editar Produto" : "Novo Produto"}
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <Label>Nome *</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div>
              <Label>Preço *</Label>
              <Input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <Label>Preço original</Label>
              <Input type="number" step="0.01" min="0" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} />
            </div>
            <div>
              <Label>Marca</Label>
              <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Ex: Natura, O Boticário" />
            </div>
            <div>
              <Label>Categoria</Label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">Sem categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div>
              <Label>Imagem</Label>
              <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </div>
            <div className="flex flex-wrap gap-4 items-end">
              {[
                { key: "free_shipping", label: "Frete grátis" },
                { key: "is_featured", label: "Destaque" },
                { key: "is_promotion", label: "Promoção" },
                { key: "is_kit", label: "Kit" },
                { key: "in_stock", label: "Em estoque" },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={(form as any)[opt.key]}
                    onChange={(e) => setForm({ ...form, [opt.key]: e.target.checked })}
                    className="rounded border-input"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button type="submit" disabled={loading}>
              <Check className="mr-2 h-4 w-4" />
              {loading ? "Salvando..." : editing ? "Atualizar" : "Criar Produto"}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {/* Products list */}
      <div className="mt-6 space-y-3">
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Nenhum produto cadastrado.</p>
        ) : (
          products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/50">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground text-xs">Sem img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="truncate font-medium text-card-foreground">{p.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>R$ {p.price.toFixed(2).replace(".", ",")}</span>
                  {p.brand && <span>• {p.brand}</span>}
                  {p.is_featured && <span className="text-primary">★ Destaque</span>}
                  {p.free_shipping && <span className="text-success">Frete grátis</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
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
