import { useState } from 'react';
import type { FinancialItem } from "../../types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FinancialListProps {
    financials: FinancialItem[];
    totalPotential: number;
    totalSold: number;
}

const ITEMS_PER_PAGE = 5;

export const FinancialList = ({ financials, totalPotential, totalSold }: FinancialListProps) => {
    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = Math.ceil(financials.length / ITEMS_PER_PAGE);

    // Safety check if page exceeds bounds (e.g. data filtered)
    if (currentPage >= totalPages && totalPages > 0) {
        setCurrentPage(totalPages - 1);
    }

    const currentItems = financials.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
        <div className="mb-6">
            <div className="flex justify-between items-end mb-2 px-1">
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Potencial</h3>
                <span className="text-sm font-bold text-white/70 drop-shadow-sm">
                    {formatCurrency(totalPotential)}
                </span>
            </div>

            <div className="flex justify-between items-end mb-4 px-1 pb-2 border-b border-white/10">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Faturamento
                </h3>
                <span className="text-xl font-bold text-green-400 drop-shadow-sm">
                    {formatCurrency(totalSold)}
                </span>
            </div>

            <div className="bg-black/20 rounded-xl p-2 h-64 flex flex-col border border-white/5 relative">
                <div className="flex-1 overflow-visible space-y-1">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-1"
                        >
                            {currentItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex justify-between items-center p-2 rounded-lg transition-all ${item.sold
                                        ? "bg-green-500/20 border border-green-500/30"
                                        : "hover:bg-white/5 border border-transparent"
                                        }`}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 transition-colors ${item.sold ? "bg-green-500 border-green-500" : "border-white/30"
                                            }`}>
                                            {item.sold && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                        <span className={`truncate font-medium max-w-[120px] transition-colors ${item.sold ? "text-green-100" : "text-gray-300"
                                            }`} title={item.name}>
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className={`font-mono text-xs sm:text-sm transition-colors ${item.sold ? "text-green-200" : "text-white"
                                        }`}>
                                        {formatCurrency(item.value)}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {financials.length === 0 && (
                        <div className="text-center py-10 text-gray-500 text-xs text-italic">Nenhum condomínio listado.</div>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-2 pt-2 border-t border-white/5">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="p-1 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <ChevronLeft size={14} className="text-white/70" />
                        </button>

                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentPage(idx)}
                                    className={`w-6 h-6 rounded-full text-xs font-medium flex items-center justify-center transition-all ${currentPage === idx
                                        ? "bg-blue-600/80 text-white shadow-sm scale-110"
                                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="p-1 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <ChevronRight size={14} className="text-white/70" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
