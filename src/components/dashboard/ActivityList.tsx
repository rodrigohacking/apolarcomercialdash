import type { ActivityItem } from "../../types";
import { ProgressBar } from "../ui/ProgressBar";
import {
  Trophy,
  Calendar,
  PhoneCall,
  Bot,
  Megaphone,
  Search,
  Building2,
  Handshake,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ActivityListProps {
  activities: ActivityItem[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  "Contratos Fechados": Trophy,
  Reuniões: Calendar,
  Discador: PhoneCall,
  BOT: Bot,
  MKT: Megaphone,
  Prospecção: Search,
  "Síndicos Profissionais": Building2,
  "Busca Externa": Users,
  "Parceria Fechada": Handshake,
};

const isHighlight = (label: string) =>
  label === "Contratos Fechados" || label === "Parceria Fechada";

export const ActivityList = ({ activities }: ActivityListProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-[11px] font-semibold text-white/55 uppercase tracking-[0.16em]">
          Atividades semanais
        </h3>
        <span className="text-[10px] text-white/35 number-tab">
          realizado / agendado
        </span>
      </div>

      <ul className="space-y-2.5">
        {activities.map((act) => {
          const Icon = ICON_MAP[act.label] ?? Calendar;
          const highlight = isHighlight(act.label);
          const isComplete =
            act.scheduled > 0 && act.realized >= act.scheduled;

          return (
            <li
              key={act.id}
              className="group rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
            >
              <div className="flex justify-between items-center mb-1 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-white/85">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
                      highlight
                        ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
                        : isComplete
                          ? "bg-emerald-500/10 border-emerald-400/20 text-emerald-300"
                          : "bg-white/[0.04] border-white/10 text-white/70"
                    }`}
                  >
                    <Icon size={12} strokeWidth={2.2} />
                  </span>
                  <span className="font-medium truncate pr-2">{act.label}</span>
                </div>
                <span className="number-tab text-white/60 font-semibold">
                  {highlight ? (
                    <span className="text-emerald-300 text-base">
                      {act.realized}
                    </span>
                  ) : (
                    <>
                      <span
                        className={
                          isComplete ? "text-emerald-300" : "text-white"
                        }
                      >
                        {act.realized}
                      </span>
                      <span className="text-white/30 mx-1">/</span>
                      <span className="text-white/55">{act.scheduled}</span>
                    </>
                  )}
                </span>
              </div>
              {!highlight && (
                <ProgressBar value={act.realized} total={act.scheduled} />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
