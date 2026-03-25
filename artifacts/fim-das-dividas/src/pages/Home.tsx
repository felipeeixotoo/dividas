import { useState } from "react";
import { Plus, Loader2, LayoutDashboard, Clock, List, TrendingDown } from "lucide-react";
import { useDebts } from "../hooks/useDebts";
import { Dashboard } from "../components/Dashboard";
import { DebtCard } from "../components/DebtCard";
import { Timeline } from "../components/Timeline";
import { AddDebtModal } from "../components/AddDebtModal";
import { Debt } from "../types/debt";
import { getCurrentMonthKey } from "../lib/debtUtils";

type Tab = "dashboard" | "debts" | "timeline";

export default function Home() {
  const { debts, loading, addDebt, deleteDebt, toggleMonthPaid } = useDebts();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const currentMonthKey = getCurrentMonthKey();
  const now = new Date();
  const monthName = now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const handleToggleMonthPaid = async (debt: Debt, monthKey: string) => {
    await toggleMonthPaid(debt, monthKey);
  };

  const tabs = [
    { id: "dashboard" as Tab, label: "Resumo", icon: LayoutDashboard },
    { id: "debts" as Tab, label: "Dívidas", icon: List },
    { id: "timeline" as Tab, label: "Projeção", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-lg mx-auto px-4 pb-24">
        <header className="pt-8 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="text-blue-400" size={22} />
            <h1 className="text-xl font-bold text-white">Fim das Dívidas</h1>
          </div>
          <p className="text-gray-400 text-sm capitalize">{monthName}</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-blue-400" size={28} />
            <p className="text-gray-400 text-sm">Carregando dívidas...</p>
          </div>
        ) : (
          <>
            <div className="flex rounded-xl bg-gray-800/60 p-1 border border-gray-700/40 mb-5">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === id
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "dashboard" && (
              <div className="space-y-5">
                <Dashboard debts={debts} />

                <div>
                  <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-400 rounded-full" />
                    Parcelas de{" "}
                    {now.toLocaleDateString("pt-BR", { month: "long" })}
                  </h2>
                  {debts.filter(
                    (d) => d.totalInstallments - d.paidInstallments > 0
                  ).length === 0 ? (
                    <p className="text-center text-gray-500 text-sm py-8">
                      Nenhuma dívida ativa.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {debts
                        .filter((d) => d.totalInstallments - d.paidInstallments > 0)
                        .map((debt) => (
                          <DebtCard
                            key={debt.id}
                            debt={debt}
                            onDelete={deleteDebt}
                            onToggleMonthPaid={handleToggleMonthPaid}
                          />
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "debts" && (
              <div className="space-y-3">
                {debts.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <TrendingDown size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Nenhuma dívida cadastrada.</p>
                    <p className="text-xs mt-1 text-gray-600">
                      Toque no botão + para adicionar.
                    </p>
                  </div>
                ) : (
                  debts.map((debt) => (
                    <DebtCard
                      key={debt.id}
                      debt={debt}
                      onDelete={deleteDebt}
                      onToggleMonthPaid={handleToggleMonthPaid}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === "timeline" && (
              <div>
                <div className="mb-4">
                  <h2 className="text-sm font-semibold text-gray-300 mb-1">
                    Linha do Tempo de Quitação
                  </h2>
                  <p className="text-xs text-gray-500">
                    Ordenado por data de quitação. A última dívida está marcada com bandeira.
                  </p>
                </div>
                <Timeline debts={debts} />
              </div>
            )}
          </>
        )}
      </div>

      <div className="fixed bottom-6 right-4 z-40">
        <button
          onClick={() => setShowModal(true)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center transition-all duration-200 active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      {showModal && (
        <AddDebtModal
          onClose={() => setShowModal(false)}
          onAdd={addDebt}
        />
      )}
    </div>
  );
}
