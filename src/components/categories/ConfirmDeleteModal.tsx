import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Category } from "../../types/category";
import { getErrorMessage } from "../../utils/getErrorMessage";

interface ConfirmDeleteModalProps {
  category: Category;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const ConfirmDeleteModal = ({
  category,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await onConfirm();
    } catch (err) {
      setError(getErrorMessage(err));
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-800">
          Eliminar categoría
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          ¿Seguro que quieres eliminar <strong>{category.name}</strong>? Esta
          acción no se puede deshacer.
        </p>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting && <Loader2 size={16} className="animate-spin" />}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
