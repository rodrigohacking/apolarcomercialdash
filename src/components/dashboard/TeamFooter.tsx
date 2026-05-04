import { useState } from "react";
import type { TeamStats, Consultant, FinancialItem } from "../../types";
import { Card } from "../ui/Card";
import { Briefcase, CalendarCheck, CalendarDays, Send } from "lucide-react";
import { StatItem } from "./StatItem";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TeamFooterProps {
  stats: TeamStats;
  team: Consultant[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const TeamFooter = ({ stats, team }: TeamFooterProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const getDetailData = () => {
    if (!expandedSection) return [];

    return team
      .map((consultant) => {
        let value = 0;
        let items: FinancialItem[] = [];

        switch (expandedSection) {
          case "contracts":
            value = consultant.totalSold;
            items = consultant.financials.filter((f) => f.sold);
            break;
          case "scheduled":
            value = consultant.activities.reduce(
              (sum, act) => sum + act.scheduled,
              0,
            );
            break;
          case "realized":
            value = consultant.activities.reduce(
              (sum, act) => sum + act.realized,
              0,
            );
            break;
          case "proposals":
            value = consultant.proposalsSent;
            break;
        }

        return { ...consultant, detailValue: value, detailItems: items };
      })
      .filter((c) => c.detailValue > 0);
  };

  const detailData = getDetailData();

  const getSectionTitle = () => {
    switch (expandedSection) {
      case "contracts":
        return "Detalhamento de vendas";
      case "scheduled":
        return "Reuniões agendadas";
      case "realized":
        return "Reuniões realizadas";
      case "proposals":
        return "Propostas enviadas";
      default:
        return "";
    }
  };

  return (
    <Card className="!p-4 md:!p-6 bg-gradient-to-br from-blue-900/30 via-[#070f33]/60 to-violet-900/20 border-white/10 overflow-hidden">
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.2em] text-blue-300/80 uppercase">
            Resumo da equipe
          </div>
          <div className="text-sm text-white/55">
            Clique em um indicador para detalhar por consultor.
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatItem
          icon={Briefcase}
          label="Total contratos"
          value={stats.totalContractsValue}
          isCurrency
          color="text-emerald-300"
          bgColor="bg-emerald-500/10"
          ringColor="ring-emerald-400/30"
          sectionId="contracts"
          expandedSection={expandedSection}
          onToggle={toggleSection}
        />
        <StatItem
          icon={CalendarDays}
          label="Reuniões agendadas"
          value={stats.meetingsScheduled}
          color="text-amber-300"
          bgColor="bg-amber-500/10"
          ringColor="ring-amber-400/30"
          sectionId="scheduled"
          expandedSection={expandedSection}
          onToggle={toggleSection}
        />
        <StatItem
          icon={CalendarCheck}
          label="Reuniões realizadas"
          value={stats.meetingsRealized}
          color="text-blue-300"
          bgColor="bg-blue-500/10"
          ringColor="ring-blue-400/30"
          sectionId="realized"
          expandedSection={expandedSection}
          onToggle={toggleSection}
        />
        <StatItem
          icon={Send}
          label="Propostas enviadas"
          value={stats.proposalsSent}
          color="text-violet-300"
          bgColor="bg-violet-500/10"
          ringColor="ring-violet-400/30"
          sectionId="proposals"
          expandedSection={expandedSection}
          onToggle={toggleSection}
        />
      </div>

      <AnimatePresence mode="wait">
        {expandedSection && (
          <motion.div
            key={expandedSection}
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 24 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/10 pt-6"
          >
            <h4 className="text-[11px] font-semibold text-white/55 mb-4 uppercase tracking-[0.16em]">
              {getSectionTitle()}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detailData.length === 0 ? (
                <p className="text-sm text-white/45 italic col-span-full text-center py-4">
                  Nenhum registro encontrado para esta categoria.
                </p>
              ) : (
                detailData.map((consultant) => (
                  <div
                    key={consultant.id}
                    className="rounded-xl bg-white/[0.04] border border-white/10 p-4"
                  >
                    <div
                      className={cn(
                        "flex items-center gap-3",
                        consultant.detailItems.length > 0 &&
                          "mb-3 pb-3 border-b border-white/[0.06]",
                      )}
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 bg-white/5">
                        <img
                          src={consultant.photoUrl}
                          alt={consultant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-white text-sm truncate">
                          {consultant.name}
                        </div>
                        <div className="text-xs text-white/70 font-medium flex items-center gap-1 number-tab">
                          {expandedSection === "contracts" ? (
                            <span className="text-emerald-300">
                              {formatCurrency(consultant.detailValue)}
                            </span>
                          ) : (
                            <span className="text-blue-300 text-base font-bold">
                              {consultant.detailValue}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {consultant.detailItems.length > 0 && (
                      <ul className="space-y-1.5 max-h-44 overflow-auto scrollbar-thin pr-1">
                        {consultant.detailItems.map((item) => (
                          <li
                            key={item.id}
                            className="flex justify-between items-center text-sm rounded-md px-2 py-1.5 bg-emerald-500/5 border border-emerald-400/10"
                          >
                            <span
                              className="text-white/85 truncate mr-2 flex-1"
                              title={item.name}
                            >
                              {item.name}
                            </span>
                            <span className="font-semibold text-emerald-300 number-tab whitespace-nowrap">
                              {formatCurrency(item.value)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
