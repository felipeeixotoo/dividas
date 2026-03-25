import { Trash2, CheckCircle2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Debt } from "../types/debt";
import {
  getRemainingInstallments,
  formatPayoffDate,
  isCurrentMonthPaid,
  getCurrentMonthKey,
  formatCurrency,
  getProgressPercent,
} from "../lib/debtUtils";

interface DebtCardProps {
  debt: Debt;
  onDelete: (id: string) => void;
  onToggleMonthPaid: (debt: Debt, monthKey: string) => void;
}

export function DebtCard({ debt, onDelete, onToggleMonthPaid }: DebtCardProps) {
  const [expanded, setExpanded] = useState(false);
  const remaining = getRemainingInstallments(debt);
  const paid = isCurrentMonthPaid(debt);
  const currentMonthKey = getCurrentMonthKey();
  const progress = getProgressPercent(debt);
  const isFinished = remaining === 0;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        isFinished
          ? "bg-emerald-900/20 border-emerald-700/30"
          : paid
          ? "bg-gray-800/60 border-gray-600/40"
          : "bg-gray-800/80 border-gray-700/50"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-white text-base truncate">{debt.name}</h3>
              {isFinished ? (
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium border border-emerald-500/30">
                  Quitada
                </span>
              ) : paid ? (
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium border border-blue-500/30">
                  Pago este mês
                </span>
              ) : (
                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-medium border border-orange-500/30">
                  Pendente
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-1">
              {debt.paidInstallments}/{debt.totalInstallments} parcelas •{" "}
              {formatCurrency(debt.installmentValue)}/mês
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <button
              onClick={() => onDelete(debt.id)}
              className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
            <span>{progress}% pago</span>
            {!isFinished && (
              <span>Quitação: {formatPayoffDate(debt)}</span>
            )}
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                isFinished ? "bg-emerald-500" : "bg-blue-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {!isFinished && (
          <button
            onClick={() => onToggleMonthPaid(debt, currentMonthKey)}
            className={`mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              paid
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                : "bg-gray-700/50 text-gray-300 border border-gray-600/40 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {paid ? (
              <>
                <CheckCircle2 size={15} />
                Marcado como Pago
              </>
            ) : (
              <>
                <Clock size={15} />
                Marcar Parcela do Mês como Paga
              </>
            )}
          </button>
        )}
      </div>

      {expanded && (
        <div className="border-t border-gray-700/40 px-4 py-3 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Valor Total:</span>
            <span className="text-white font-medium">{formatCurrency(debt.totalValue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Restante:</span>
            <span className="text-white font-medium">
              {formatCurrency(remaining * debt.installmentValue)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Parcelas restantes:</span>
            <span className="text-white font-medium">{remaining}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Vencimento:</span>
            <span className="text-white font-medium">Dia {debt.dueDay}</span>
          </div>
          {debt.startDate && (
            <div className="flex justify-between">
              <span className="text-gray-400">Início:</span>
              <span className="text-white font-medium">
                {new Date(debt.startDate + "T12:00:00").toLocaleDateString("pt-BR")}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
