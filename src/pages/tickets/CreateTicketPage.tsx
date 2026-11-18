import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";

import { categoryService } from "../../services/categoryService";
import { ticketService } from "../../services/ticketService";

import type { Category } from "../../types/category";
import type { TicketPriority, CreateTicketData } from "../../types/ticket";
import { useToast } from "../../components/ui/ToastContext";

export const CreateTicketPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("MEDIA");
  const [categoryId, setCategoryId] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch {
        setError("No se pudieron cargar las categorías.");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!categoryId) {
      setError("Seleccioná una categoría.");
      return;
    }

    const ticketData: CreateTicketData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      categoryId: Number(categoryId),
    };

    try {
      setSaving(true);

      await ticketService.create(ticketData);

      showToast("¡Tu ticket fue creado correctamente!", "success");

      navigate("/tickets");
    } catch {
      setError("No se pudo crear el ticket. Intentá nuevamente.");
      showToast("No se pudo crear el ticket.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to="/tickets"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-cyan-700"
        >
          <ArrowLeft size={16} />
          Volver a mis tickets
        </Link>

        <h1 className="text-2xl font-bold text-slate-900">
          Crear nuevo ticket
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Completá los datos para registrar tu solicitud.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Título
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej. Problema con mi computadora"
            required
            maxLength={120}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Descripción
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Explicá detalladamente qué problema estás teniendo..."
            required
            rows={5}
            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="priority"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Prioridad
            </label>

            <select
              id="priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as TicketPriority)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Categoría
            </label>

            <select
              id="category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              required
              disabled={loadingCategories || categories.length === 0}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-100"
            >
              <option value="">
                {loadingCategories
                  ? "Cargando categorías..."
                  : "Seleccioná una categoría"}
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
          <Link
            to="/tickets"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={saving || loadingCategories || categories.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={16} />
            {saving ? "Creando..." : "Crear ticket"}
          </button>
        </div>
      </form>
    </section>
  );
};
