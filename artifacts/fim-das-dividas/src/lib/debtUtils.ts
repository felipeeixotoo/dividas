import { Debt } from "../types/debt";

export function getRemainingInstallments(debt: Debt): number {
  return Math.max(0, debt.totalInstallments - debt.paidInstallments);
}

export function getPayoffDate(debt: Debt): Date {
  const remaining = getRemainingInstallments(debt);
  const now = new Date();
  const payoffDate = new Date(now.getFullYear(), now.getMonth() + remaining, debt.dueDay);
  return payoffDate;
}

export function formatPayoffDate(debt: Debt): string {
  const date = getPayoffDate(debt);
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function isCurrentMonthPaid(debt: Debt): boolean {
  const key = getCurrentMonthKey();
  return debt.paidMonths?.includes(key) ?? false;
}

export function getTotalDebt(debts: Debt[]): number {
  return debts.reduce((acc, d) => {
    const remaining = getRemainingInstallments(d);
    return acc + remaining * d.installmentValue;
  }, 0);
}

export function getCurrentMonthTotal(debts: Debt[]): number {
  return debts
    .filter((d) => getRemainingInstallments(d) > 0)
    .reduce((acc, d) => acc + d.installmentValue, 0);
}

export function getLastPayoffDate(debts: Debt[]): string {
  if (debts.length === 0) return "—";
  const activeDebts = debts.filter((d) => getRemainingInstallments(d) > 0);
  if (activeDebts.length === 0) return "Todas quitadas!";
  let latest = new Date(0);
  for (const debt of activeDebts) {
    const date = getPayoffDate(debt);
    if (date > latest) latest = date;
  }
  return latest.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function getProgressPercent(debt: Debt): number {
  if (debt.totalInstallments === 0) return 0;
  return Math.round((debt.paidInstallments / debt.totalInstallments) * 100);
}

export function getTimelineItems(debts: Debt[]) {
  const activeDebts = debts.filter((d) => getRemainingInstallments(d) > 0);
  return [...activeDebts]
    .sort((a, b) => getPayoffDate(a).getTime() - getPayoffDate(b).getTime())
    .map((debt) => ({
      debt,
      payoffDate: getPayoffDate(debt),
      payoffDateStr: formatPayoffDate(debt),
    }));
}
