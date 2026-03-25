import { Flag, Circle } from "lucide-react";
import { Debt } from "../types/debt";
import { getTimelineItems, formatCurrency } from "../lib/debtUtils";

interface TimelineProps {
  debts: Debt[];
}

export function Timeline({ debts }: TimelineProps) {
  const items = getTimelineItems(debts);

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        Nenhuma dívida ativa para mostrar na linha do tempo.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-700/60" />
      <div className="space-y-4">
        {items.map(({ debt, payoffDateStr }, index) => {
          const isLast = index === items.length - 1;
          return (
            <div key={debt.id} className="relative flex items-start gap-4 pl-10">
              <div
                className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 ${
                  isLast
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                    : "bg-gray-800 border-gray-600 text-gray-400"
                }`}
              >
                {isLast ? <Flag size={14} /> : <Circle size={10} fill="currentColor" />}
              </div>
              <div
                className={`flex-1 rounded-xl border p-3 ${
                  isLast
                    ? "bg-emerald-900/20 border-emerald-700/30"
                    : "bg-gray-800/60 border-gray-700/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`font-semibold text-sm ${isLast ? "text-emerald-300" : "text-white"}`}>
                      {debt.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{payoffDateStr}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">Parcela</p>
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(debt.installmentValue)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-gray-700/50 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${isLast ? "bg-emerald-500" : "bg-blue-500"}`}
                      style={{
                        width: `${Math.round((debt.paidInstallments / debt.totalInstallments) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {debt.totalInstallments - debt.paidInstallments} restantes
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
