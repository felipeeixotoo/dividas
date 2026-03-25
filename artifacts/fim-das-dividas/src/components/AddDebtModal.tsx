import { useState } from "react";
import { X, Plus } from "lucide-react";
import { DebtFormData } from "../types/debt";

interface AddDebtModalProps {
  onClose: () => void;
  onAdd: (data: DebtFormData) => Promise<void>;
}

const defaultForm: DebtFormData = {
  name: "",
  totalValue: "",
  installmentValue: "",
  dueDay: "",
  totalInstallments: "",
  paidInstallments: "0",
  startDate: "",
};

export function AddDebtModal({ onClose, onAdd }: AddDebtModalProps) {
  const [form, setForm] = useState<DebtFormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Nome da dívida é obrigatório.");
    if (!form.installmentValue || parseFloat(form.installmentValue) <= 0)
      return setError("Valor da parcela inválido.");
    if (!form.totalInstallments || parseInt(form.totalInstallments) <= 0)
      return setError("Total de parcelas inválido.");
    if (!form.dueDay || parseInt(form.dueDay) < 1 || parseInt(form.dueDay) > 31)
      return setError("Dia de vencimento inválido (1-31).");

    const totalVal = parseFloat(form.totalValue) || parseFloat(form.installmentValue) * parseInt(form.totalInstallments);
    const paid = parseInt(form.paidInstallments) || 0;
    const total = parseInt(form.totalInstallments);

    if (paid > total) return setError("Parcelas pagas não pode ser maior que o total.");

    setLoading(true);
    try {
      await onAdd({
        ...form,
        totalValue: String(totalVal),
        paidInstallments: String(paid),
      });
      onClose();
    } catch {
      setError("Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700/60 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Nova Dívida</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Nome da Dívida *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex: Cartão Nubank, Financiamento..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Valor Total (R$)
              </label>
              <input
                name="totalValue"
                type="number"
                step="0.01"
                min="0"
                value={form.totalValue}
                onChange={handleChange}
                placeholder="0,00"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Valor da Parcela *
              </label>
              <input
                name="installmentValue"
                type="number"
                step="0.01"
                min="0.01"
                value={form.installmentValue}
                onChange={handleChange}
                placeholder="0,00"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Dia Venc. *
              </label>
              <input
                name="dueDay"
                type="number"
                min="1"
                max="31"
                value={form.dueDay}
                onChange={handleChange}
                placeholder="10"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Total Parcelas *
              </label>
              <input
                name="totalInstallments"
                type="number"
                min="1"
                value={form.totalInstallments}
                onChange={handleChange}
                placeholder="12"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Já Pagas
              </label>
              <input
                name="paidInstallments"
                type="number"
                min="0"
                value={form.paidInstallments}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Data de Início
            </label>
            <input
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            <Plus size={16} />
            {loading ? "Salvando..." : "Adicionar Dívida"}
          </button>
        </form>
      </div>
    </div>
  );
}
