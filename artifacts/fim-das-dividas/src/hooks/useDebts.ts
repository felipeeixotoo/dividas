import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Debt, DebtFormData } from "../types/debt";

const COLLECTION = "debts";

export function useDebts() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const TIMEOUT_MS = 3000;
    let resolved = false;

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        setLoading(false);
      }
    }, TIMEOUT_MS);

    const unsubscribe = onSnapshot(
      collection(db, COLLECTION),
      (snapshot) => {
        resolved = true;
        clearTimeout(timeout);
        const data: Debt[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Debt, "id">),
        }));
        data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setDebts(data);
        setLoading(false);
      },
      (error) => {
        resolved = true;
        clearTimeout(timeout);
        console.error("Firestore error:", error);
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const addDebt = async (formData: DebtFormData) => {
    const debt = {
      name: formData.name.trim(),
      totalValue: parseFloat(formData.totalValue) || 0,
      installmentValue: parseFloat(formData.installmentValue) || 0,
      dueDay: parseInt(formData.dueDay) || 1,
      totalInstallments: parseInt(formData.totalInstallments) || 1,
      paidInstallments: parseInt(formData.paidInstallments) || 0,
      startDate: formData.startDate,
      createdAt: Date.now(),
      paidMonths: [] as string[],
    };
    await addDoc(collection(db, COLLECTION), debt);
  };

  const updateDebt = async (id: string, updates: Partial<Omit<Debt, "id">>) => {
    await updateDoc(doc(db, COLLECTION, id), updates);
  };

  const deleteDebt = async (id: string) => {
    await deleteDoc(doc(db, COLLECTION, id));
  };

  const toggleMonthPaid = async (debt: Debt, monthKey: string) => {
    const paidMonths = debt.paidMonths || [];
    let newPaidMonths: string[];
    let newPaidInstallments: number;

    if (paidMonths.includes(monthKey)) {
      newPaidMonths = paidMonths.filter((m) => m !== monthKey);
      newPaidInstallments = Math.max(0, debt.paidInstallments - 1);
    } else {
      newPaidMonths = [...paidMonths, monthKey];
      newPaidInstallments = Math.min(debt.totalInstallments, debt.paidInstallments + 1);
    }

    await updateDoc(doc(db, COLLECTION, debt.id), {
      paidMonths: newPaidMonths,
      paidInstallments: newPaidInstallments,
    });
  };

  return { debts, loading, addDebt, updateDebt, deleteDebt, toggleMonthPaid };
}
