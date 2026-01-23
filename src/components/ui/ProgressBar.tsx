import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface ProgressBarProps {
    value: number;
    total: number;
    className?: string;
    showLabels?: boolean;
    label?: string;
}

export const ProgressBar = ({ value, total, className, showLabels, label }: ProgressBarProps) => {
    const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;
    const isComplete = value >= total && total > 0;

    // Colors: Green if realized >= scheduled (and scheduled > 0), else Blue/Gray
    // Actually, if scheduled is 0, logic might vary. Assuming if scheduled > 0 and realized >= scheduled -> Success.

    const barColor = isComplete
        ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
        : "bg-blue-500/80 shadow-[0_0_10px_rgba(59,130,246,0.5)]";

    return (
        <div className={cn("w-full", className)}>
            {showLabels && (
                <div className="flex justify-between items-center mb-1 text-sm font-medium text-gray-300">
                    <span>{label}</span>
                    <span>{value} / {total}</span>
                </div>
            )}
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn("h-full rounded-full transition-colors duration-500", barColor)}
                />
            </div>
        </div>
    );
};
