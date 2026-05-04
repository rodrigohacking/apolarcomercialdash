import { useEffect, useMemo, useState } from "react";
import type { FinancialItem } from "../../types";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

interface FinancialListProps {
  financials: FinancialItem[];
  totalPotential: number;
  totalSold: number;
}

const ITEMS_PER_PAGE = 5;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const FinancialList = ({
  financials,
  totalPotential,
  totalSold,
}: FinancialListProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const sorted = useMemo(
    () =>
      [...financials].sort((a, b) => {
        if (a.sold && !b.sold) return -1;
        if (!a.sold && b.sold) return 1;
        return b.value - a.value;
      }),
    [financials],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage >= totalPages) setCurrentPage(0);
  }, [totalPages, currentPage]);

  const currentItems = sorted.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  const conversionPct =
    totalPotential + totalSold > 0
      ? Math.round((totalSold / (totalPotential + totalSold)) * 100)
      : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="text-[10px] font-semibold tracking-[0.18em] text-white/45 uppercase">
            Potencial
          </div>
          <div className="mt-1 text-base font-bold text-white/90 number-tab">
            {formatCurrency(totalPotential)}
          </div>
        </div>
        <div className="rounded-xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 p-3 shadow-glow-emerald">
          <div className="text-[10px] font-semibold tracking-[0.18em] text-emerald-300 uppercase flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            Faturamento
          </div>
          <div className="mt-1 text-lg font-bold text-emerald-300 number-tab">
            {formatCurrency(totalSold)}
          </div>
        </div>
      </div>

      {totalPotential + totalSold > 0 && (
        <div className="flex items-center gap-2 px-1">
          <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full transition-all duration-700"
              style={{ width: `${conversionPct}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold text-emerald-300 number-tab w-9 text-right">
            {conversionPct}%
          </span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-[11px] font-semibold text-white/55 uppercase tracking-[0.16em]">
            Condomínios
          </h3>
          <span className="text-[11px] text-white/40 number-tab">
            {sorted.length} {sorted.length === 1 ? "item" : "itens"}
          </span>
        </div>

        <div className="rounded-xl bg-black/20 border border-white/[0.06] p-2 min-h-[18rem] flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.ul
                key={currentPage}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-1"
              >
                {currentItems.map((item) => (
                  <li
                    key={item.id}
                    className={`group flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 border transition-all ${
                      item.sold
                        ? "bg-emerald-500/10 border-emerald-400/25"
                        : "border-transparent hover:bg-white/[0.04] hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {item.sold ? (
                        <CheckCircle2
                          size={16}
                          className="shrink-0 text-emerald-300"
                        />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-white/15 shrink-0" />
                      )}
                      <span
                        className={`truncate text-sm ${
                          item.sold
                            ? "text-emerald-50 font-semibold"
                            : "text-white/85 font-medium"
                        }`}
                        title={item.name}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span
                      className={`number-tab text-xs font-semibold whitespace-nowrap ${
                        item.sold ? "text-emerald-200" : "text-white/70"
                      }`}
                    >
                      {formatCurrency(item.value)}
                    </span>
                  </li>
                ))}

                {Array.from({
                  length: Math.max(0, ITEMS_PER_PAGE - currentItems.length),
                }).map((_, idx) => (
                  <li
                    key={`spacer-${idx}`}
                    className="h-9 rounded-lg bg-transparent"
                  />
                ))}
              </motion.ul>
            </AnimatePresence>

            {sorted.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-white/40 text-xs gap-2">
                <Inbox size={20} />
                Nenhum condomínio listado.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center gap-2 mt-2 pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="ring-focus p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30 transition"
                aria-label="Página anterior"
              >
                <ChevronLeft size={14} className="text-white/70" />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`ring-focus h-1.5 rounded-full transition-all ${
                      currentPage === idx
                        ? "w-6 bg-blue-400"
                        : "w-1.5 bg-white/15 hover:bg-white/30"
                    }`}
                    aria-label={`Página ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={currentPage === totalPages - 1}
                className="ring-focus p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30 transition"
                aria-label="Próxima página"
              >
                <ChevronRight size={14} className="text-white/70" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
