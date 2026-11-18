import { useEffect, useState } from "react";
import { categoryService } from "../../services/categoryService";
import type { Category } from "../../types/category";
import { getErrorMessage } from "../../utils/getErrorMessage";
interface CategorySelectProps {
  value: number | "";
  onChange: (value: number | "") => void;
  disabled?: boolean;
  error?: string;
}

export const CategorySelect = ({
  value,
  onChange,
  disabled,
  error,
}: CategorySelectProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    categoryService
      .getAll()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch((err) => {
        if (active) {
          setLoadError(
            getErrorMessage(err, "No se pudieron cargar las categorías"),
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">Categoría</label>
      <select
        value={value}
        disabled={disabled || isLoading}
        onChange={(e) =>
          onChange(e.target.value === "" ? "" : Number(e.target.value))
        }
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
      >
        <option value="">
          {isLoading ? "Cargando categorías..." : "Selecciona una categoría"}
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {(loadError || error) && (
        <p className="text-xs text-red-600">{loadError ?? error}</p>
      )}
    </div>
  );
};
