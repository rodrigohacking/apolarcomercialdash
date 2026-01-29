import { ChevronUp, ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface StatItemProps {
    icon: LucideIcon;
    label: string;
    value: number;
    isCurrency?: boolean;
    color?: string;
    bgColor?: string;
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
    color = "text-blue-400",
    bgColor = "bg-blue-400/10",
    sectionId,
    className,
    expandedSection,
    onToggle
}: StatItemProps) => (
    <div
        onClick={() => sectionId && onToggle(sectionId)}
        className={cn(
            "flex items-center gap-3 transition-all",
            sectionId ? "cursor-pointer hover:bg-white/5 p-2 rounded-lg -m-2" : "",
            className,
            expandedSection === sectionId ? "bg-white/5 ring-1 ring-white/10" : ""
        )}
    >
        <div className={cn("p-2.5 rounded-xl transition-transform", bgColor, expandedSection === sectionId ? "scale-110" : "")}>
            <Icon className={cn("w-5 h-5", color)} />
        </div>
        <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-medium flex items-center gap-1">
                {label}
                {sectionId && (
                    expandedSection === sectionId ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                )}
            </div>
            <div className="text-lg font-bold text-white">
                {isCurrency
                    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
                    : value
                }
            </div>
        </div>
    </div>
);
