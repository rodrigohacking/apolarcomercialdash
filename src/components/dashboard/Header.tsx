import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

interface HeaderProps {
  weekRange: string;
  availableWeeks?: { label: string; index: number }[];
  currentWeekIndex?: number;
  onWeekSelect?: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  lastUpdated?: Date | null;
  userEmail?: string | null;
}

const formatLastUpdated = (date: Date | null | undefined) => {
  if (!date) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const Header = ({
  weekRange,
  availableWeeks = [],
  currentWeekIndex = 0,
  onWeekSelect,
  onNext,
  onPrev,
  onRefresh,
  refreshing = false,
  lastUpdated,
  userEmail,
}: HeaderProps) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const updatedAt = formatLastUpdated(lastUpdated);

  return (
    <header className="relative z-20 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-soft">
          <img
            src="/logo.png"
            alt="Apolar Condomínios"
            className="h-8 w-auto object-contain"
          />
        </div>
        <div className="hidden md:block">
          <div className="text-[11px] font-semibold tracking-[0.2em] text-blue-300/80 uppercase">
            Apolar Comercial
          </div>
          <h1 className="text-lg lg:text-xl font-bold text-white tracking-tight">
            Painel de Resultados
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex items-center gap-1 surface-card !p-1 !rounded-full">
          <button
            type="button"
            onClick={onNext}
            className="ring-focus p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={
              availableWeeks.length > 0 &&
              currentWeekIndex === availableWeeks.length - 1
            }
            aria-label="Semana anterior"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white relative">
            <Calendar size={14} className="text-blue-300" />
            <span className="select-none whitespace-nowrap">
              Semana de {weekRange}
            </span>
            {availableWeeks.length > 1 && onWeekSelect && (
              <select
                aria-label="Selecionar semana"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={currentWeekIndex}
                onChange={(e) => onWeekSelect(parseInt(e.target.value))}
              >
                {availableWeeks.map((week) => (
                  <option
                    key={week.index}
                    value={week.index}
                    className="text-black"
                  >
                    {week.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="button"
            onClick={onPrev}
            className="ring-focus p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={availableWeeks.length > 0 && currentWeekIndex === 0}
            aria-label="Próxima semana"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="ring-focus group flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/90 hover:bg-blue-400 text-white text-sm font-semibold shadow-glow transition disabled:opacity-60"
            title={
              updatedAt
                ? `Atualizado às ${updatedAt}`
                : "Atualizar dados da planilha"
            }
          >
            <RefreshCw
              size={14}
              className={refreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}
            />
            <span className="hidden sm:inline">
              {refreshing ? "Atualizando..." : "Atualizar"}
            </span>
          </button>
        )}

        {userEmail && (
          <div className="hidden lg:flex items-center gap-2 surface-card !p-1.5 !pr-3 !rounded-full">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold uppercase">
              {userEmail.charAt(0)}
            </div>
            <span className="text-xs text-white/80 max-w-[160px] truncate">
              {userEmail}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="ring-focus ml-1 p-1.5 rounded-full text-white/60 hover:text-red-300 hover:bg-red-500/10 transition"
              title="Sair"
              aria-label="Sair"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
