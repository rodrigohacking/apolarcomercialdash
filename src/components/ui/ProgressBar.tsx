import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface ProgressBarProps {
  value: number;
  total: number;
  className?: string;
  showLabels?: boolean;
  label?: string;
  tone?: "blue" | "emerald" | "amber" | "violet";
}

const TONES = {
  blue: "from-sky-400 to-blue-500 shadow-[0_0_18px_rgba(56,130,246,0.45)]",
  emerald:
    "from-emerald-400 to-green-500 shadow-[0_0_18px_rgba(16,185,129,0.45)]",
  amber:
    "from-amber-400 to-orange-500 shadow-[0_0_18px_rgba(245,158,11,0.4)]",
  violet:
    "from-violet-400 to-purple-500 shadow-[0_0_18px_rgba(139,92,246,0.4)]",
} as const;

export const ProgressBar = ({
  value,
  total,
  className,
  showLabels,
  label,
  tone = "blue",
}: ProgressBarProps) => {
  const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  const isComplete = value >= total && total > 0;
  const finalTone = isComplete ? "emerald" : tone;

  return (
    <div className={cn("w-full", className)}>
      {showLabels && (
        <div className="flex justify-between items-center mb-1.5 text-sm font-medium text-white/80">
          <span>{label}</span>
          <span className="number-tab">
            {value} / {total}
          </span>
        </div>
      )}
      <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "h-full rounded-full bg-gradient-to-r",
            TONES[finalTone],
          )}
        />
      </div>
    </div>
  );
};
