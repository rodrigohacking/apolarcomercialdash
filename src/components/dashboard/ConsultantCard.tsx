import { Card } from "../ui/Card";
import type { Consultant } from "../../types";
import { ActivityList } from "./ActivityList";
import { FinancialList } from "./FinancialList";

interface ConsultantCardProps {
  consultant: Consultant;
}

export const ConsultantCard = ({ consultant }: ConsultantCardProps) => {
  const initials = consultant.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card hover className="h-full flex flex-col !p-5 md:!p-6">
      <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/[0.06]">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl p-[2px] bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500">
            <div className="w-full h-full rounded-[14px] bg-[#040b28] overflow-hidden flex items-center justify-center">
              {consultant.photoUrl ? (
                <img
                  src={consultant.photoUrl}
                  alt={consultant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <span className="text-lg font-bold text-white/80">
                  {initials}
                </span>
              )}
            </div>
          </div>
          <span className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#040b28]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold tracking-[0.2em] text-blue-300/80 uppercase">
            {consultant.role}
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight truncate">
            {consultant.name}
          </h2>
        </div>
      </div>

      <div className="flex-1 space-y-5">
        <FinancialList
          financials={consultant.financials}
          totalPotential={consultant.totalFinancial}
          totalSold={consultant.totalSold}
        />
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <ActivityList activities={consultant.activities} />
      </div>
    </Card>
  );
};
