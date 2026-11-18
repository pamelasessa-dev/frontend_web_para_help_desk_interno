import { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import {
  categoryService,
  type CategoryPayload,
} from "../../services/categoryService";
import type { Category } from "../../types/category";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { CategoryFormModal } from "../../components/categories/CategoryFormModal";
import { ConfirmDeleteModal } from "../../components/categories/ConfirmDeleteModal";

interface Notice {
  type: "success" | "error";
  text: string;
}

export const CategoriesPage = () => {
  const role = useAuthStore((state) => state.user?.role);
  const canManage = role === "ADMIN" || role === "AGENTE";

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const [notice, setNotice] = useState<Notice | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      setCategories(await categoryService.getAll());
    } catch (error) {
      setLoadError(
        getErrorMessage(error, "No se pudieron cargar las categorías"),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const openCreate = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (data: CategoryPayload) => {
    if (editingCategory) {
      await categoryService.update(editingCategory.id, data);
      setNotice({
        type: "success",
        text: "Categoría actualizada correctamente",
      });
    } else {
      await categoryService.create(data);
      setNotice({ type: "success", text: "Categoría creada correctamente" });
    }

    closeForm();
    await loadCategories();
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    await categoryService.remove(categoryToDelete.id);
    setCategoryToDelete(null);
    setNotice({ type: "success", text: "Categoría eliminada correctamente" });
    await loadCategories();
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categorías</h1>
          <p className="text-sm text-gray-500">
            Administra las categorías del catálogo de tickets.
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Nueva categoría
          </button>
        )}
      </div>

      {notice && (
        <div
          className={`mb-4 rounded-md border p-3 text-sm ${
            notice.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-gray-500">
            <Loader2 size={20} className="animate-spin" />
            Cargando categorías...
          </div>
        ) : loadError ? (
          <div className="p-10 text-center">
            <p className="text-sm text-red-600">{loadError}</p>
            <button
              type="button"
              onClick={loadCategories}
              className="mt-3 text-sm font-medium text-blue-600 hover:underline"
            >
              Reintentar
            </button>
          </div>
        ) : categories.length === 0 ? (
          <p className="p-10 text-center text-sm text-gray-500">
            Todavía no hay categorías registradas.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Descripción</th>
                  {canManage && (
                    <th className="px-4 py-3 text-right font-medium">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {category.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {category.description || "—"}
                    </td>
                    {canManage && (
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(category)}
                            className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                            aria-label={`Editar ${category.name}`}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCategoryToDelete(category)}
                            className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600"
                            aria-label={`Eliminar ${category.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormOpen && (
        <CategoryFormModal
          category={editingCategory}
          onClose={closeForm}
          onSubmit={handleSubmit}
        />
      )}

      {categoryToDelete && (
        <ConfirmDeleteModal
          category={categoryToDelete}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};