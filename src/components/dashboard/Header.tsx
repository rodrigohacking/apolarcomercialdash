import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface HeaderProps {
    weekRange: string;
    availableWeeks?: { label: string; index: number }[];
    currentWeekIndex?: number;
    onWeekSelect?: (index: number) => void;
    onNext: () => void;
    onPrev: () => void;
    onRefresh?: () => void;
}

export const Header = ({
    weekRange,
    availableWeeks = [],
    currentWeekIndex = 0,
    onWeekSelect,
    onNext,
    onPrev,
    onRefresh
}: HeaderProps) => {
    return (
        <header className="flex flex-col md:flex-row justify-between items-center py-6 px-4 md:px-0 mb-4 gap-4">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
                <img src="/logo.png" alt="Apolar Condomínios" className="h-12 w-auto object-contain drop-shadow-lg" />
                <div className="h-8 w-px bg-white/10 hidden md:block" />
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight hidden md:block">
                    Resultados Comerciais
                </h1>
            </div>

            {/* Date Selector */}
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-2 py-1.5 shadow-md relative group">
                <button
                    onClick={onNext} // Left arrow goes to OLDER (Next in list)
                    className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={availableWeeks.length > 0 && currentWeekIndex === availableWeeks.length - 1}
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-2 px-3 text-sm md:text-base font-medium text-white relative">
                    <Calendar size={16} className="text-blue-400" />
                    <span className="cursor-pointer select-none">
                        Semana de {weekRange}
                    </span>

                    {/* Dropdown for Week Selection */}
                    {availableWeeks.length > 1 && onWeekSelect && (
                        <select
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            value={currentWeekIndex}
                            onChange={(e) => onWeekSelect(parseInt(e.target.value))}
                        >
                            {availableWeeks.map((week) => (
                                <option key={week.index} value={week.index} className="text-black">
                                    {week.label}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <button
                    onClick={onPrev} // Right arrow goes to NEWER (Prev in list)
                    className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={availableWeeks.length > 0 && currentWeekIndex === 0}
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {onRefresh && (
                <button
                    onClick={onRefresh}
                    className="p-2 rounded-full bg-blue-600/80 hover:bg-blue-600 text-white transition-colors shadow-lg flex items-center gap-2 px-4 text-sm font-medium"
                    title="Atualizar dados da planilha"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-spin-once"
                    >
                        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                        <path d="M16 16h5v5" />
                    </svg>
                    <span>Atualizar</span>
                </button>
            )}

            {/* Mobile Title Fallback */}
            <h1 className="text-xl font-bold text-white tracking-tight md:hidden">
                Resultados Comerciais
            </h1>
        </header>
    );
};
