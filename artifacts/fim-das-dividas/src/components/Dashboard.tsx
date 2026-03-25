import { Wallet, Calendar, TrendingDown, CheckCircle2 } from "lucide-react";
import { Debt } from "../types/debt";
import {
  getTotalDebt,
  getCurrentMonthTotal,
  getLastPayoffDate,
  formatCurrency,
} from "../lib/debtUtils";

interface DashboardProps {
  debts: Debt[];
}

export function Dashboard({ debts }: DashboardProps) {
  const totalDebt = getTotalDebt(debts);
  const monthlyTotal = getCurrentMonthTotal(debts);
  const lastPayoff = getLastPayoffDate(debts);
  const activeCount = debts.filter(
    (d) => d.totalInstallments - d.paidInstallments > 0
  ).length;

  const cards = [
    {
      label: "Total em Dívidas",
      value: formatCurrency(totalDebt),
      icon: Wallet,
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
    },
    {
      label: "A Pagar Este Mês",
      value: formatCurrency(monthlyTotal),
      icon: Calendar,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/20",
    },
    {
      label: "Última Dívida Quitada",
      value: lastPayoff,
      icon: TrendingDown,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      small: true,
    },
    {
      label: "Dívidas Ativas",
      value: String(activeCount),
      icon: CheckCircle2,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color, bg, small }) => (
        <div
          key={label}
          className={`rounded-xl border p-4 flex flex-col gap-2 ${bg}`}
        >
          <div className={`${color} opacity-80`}>
            <Icon size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium leading-tight">{label}</p>
            <p
              className={`font-bold mt-1 leading-tight ${small ? "text-sm" : "text-lg"} text-white`}
            >
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
