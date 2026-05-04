import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface StatItemProps {
  icon: LucideIcon;
  label: string;
  value: number;
  isCurrency?: boolean;
  color?: string;
  bgColor?: string;
  ringColor?: string;
  sectionId?: string;
  className?: string;
  expandedSection: string | null;
  onToggle: (section: string) => void;
}

export const StatItem = ({
  icon: Icon,
  label,
  value,
  isCurrency = false,
  color = "text-blue-300",
  bgColor = "bg-blue-500/10",
  ringColor = "ring-blue-400/20",
  sectionId,
  className,
  expandedSection,
  onToggle,
}: StatItemProps) => {
  const expanded = expandedSection === sectionId;
  return (
    <button
      type="button"
      onClick={() => sectionId && onToggle(sectionId)}
      className={cn(
        "ring-focus group flex items-center gap-3 p-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-left transition-all",
        sectionId && "hover:bg-white/[0.05] hover:border-white/15",
        expanded && cn("border-white/15 bg-white/[0.06] ring-1", ringColor),
        className,
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 transition-transform",
          bgColor,
          expanded && "scale-105",
        )}
      >
        <Icon className={cn("w-5 h-5", color)} strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] text-white/55 uppercase tracking-[0.16em] font-semibold flex items-center gap-1">
          {label}
          {sectionId && (
            <ChevronDown
              size={12}
              className={cn(
                "transition-transform duration-300",
                expanded && "rotate-180 text-white/80",
              )}
            />
          )}
        </div>
        <div className="text-lg md:text-xl font-bold text-white number-tab leading-tight">
          {isCurrency
            ? new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(value)
            : value}
        </div>
      </div>
    </button>
  );
};
