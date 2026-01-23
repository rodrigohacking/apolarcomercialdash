import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface HeaderProps {
    weekRange: string;
    onNext: () => void;
    onPrev: () => void;
}

export const Header = ({ weekRange, onNext, onPrev }: HeaderProps) => {
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
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-2 py-1.5 shadow-md">
                <button
                    onClick={onPrev}
                    className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-2 px-3 text-sm md:text-base font-medium text-white">
                    <Calendar size={16} className="text-blue-400" />
                    <span>Semana de {weekRange}</span>
                </div>

                <button
                    onClick={onNext}
                    className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Mobile Title Fallback */}
            <h1 className="text-xl font-bold text-white tracking-tight md:hidden">
                Resultados Comerciais
            </h1>
        </header>
    );
};
