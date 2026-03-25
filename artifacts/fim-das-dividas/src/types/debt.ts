export interface Debt {
  id: string;
  name: string;
  totalValue: number;
  installmentValue: number;
  dueDay: number;
  totalInstallments: number;
  paidInstallments: number;
  startDate: string;
  createdAt: number;
  paidMonths: string[];
}

export interface DebtFormData {
  name: string;
  totalValue: string;
  installmentValue: string;
  dueDay: string;
  totalInstallments: string;
  paidInstallments: string;
  startDate: string;
}
