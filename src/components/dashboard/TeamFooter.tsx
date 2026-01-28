import { useState } from "react";
import type { TeamStats, Consultant } from "../../types";
import { Card } from "../ui/Card";
import { Briefcase, CalendarCheck, CalendarDays, Send, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TeamFooterProps {
    stats: TeamStats;
    team: Consultant[];
}

export const TeamFooter = ({ stats, team }: TeamFooterProps) => {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        if (expandedSection === section) {
            setExpandedSection(null);
        } else {
            setExpandedSection(section);
        }
    };

    const StatItem = ({
        icon: Icon,
        label,
        value,
        isCurrency = false,
        color = "text-blue-400",
        bgColor = "bg-blue-400/10",
        sectionId,
        className
    }: {
        icon: any,
        label: string,
        value: number,
        isCurrency?: boolean,
        color?: string,
        bgColor?: string,
        sectionId?: string,
        className?: string
    }) => (
        <div
            onClick={() => sectionId && toggleSection(sectionId)}
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

    const getDetailData = () => {
        if (!expandedSection) return [];

        return team.map(consultant => {
            let value = 0;
            let items: any[] = []; // Optional detailed list items

            switch (expandedSection) {
                case 'contracts':
                    value = consultant.totalSold;
                    items = consultant.financials.filter(f => f.sold);
                    break;
                case 'scheduled':
                    // Sum of all SCHEDULED activities
                    value = consultant.activities.reduce((sum, act) => sum + act.scheduled, 0);
                    break;
                case 'realized':
                    // Sum of all REALIZED activities
                    value = consultant.activities.reduce((sum, act) => sum + act.realized, 0);
                    break;
                case 'proposals':
                    value = consultant.proposalsSent;
                    break;
            }

            return {
                ...consultant,
                detailValue: value,
                detailItems: items
            };
        }).filter(c => c.detailValue > 0);
    };

    const detailData = getDetailData();

    const getSectionTitle = () => {
        switch (expandedSection) {
            case 'contracts': return "Detalhamento de Vendas";
            case 'scheduled': return "Detalhamento de Reuniões Agendadas";
            case 'realized': return "Detalhamento de Reuniões Realizadas";
            case 'proposals': return "Detalhamento de Propostas Enviadas";
            default: return "";
        }
    };

    return (
        <Card className="mt-8 !p-4 md:!p-6 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-blue-500/20 overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 cursor-default">
                <StatItem
                    icon={Briefcase}
                    label="Total Contratos"
                    value={stats.totalContractsValue}
                    isCurrency
                    color="text-emerald-400"
                    bgColor="bg-emerald-400/10"
                    sectionId="contracts"
                />
                <StatItem
                    icon={CalendarDays}
                    label="Reuniões Agendadas"
                    value={stats.meetingsScheduled}
                    color="text-amber-400"
                    bgColor="bg-amber-400/10"
                    sectionId="scheduled"
                />
                <StatItem
                    icon={CalendarCheck}
                    label="Reuniões Realizadas"
                    value={stats.meetingsRealized}
                    color="text-blue-400"
                    bgColor="bg-blue-400/10"
                    sectionId="realized"
                />
                <StatItem
                    icon={Send}
                    label="Propostas Enviadas"
                    value={stats.proposalsSent}
                    color="text-purple-400"
                    bgColor="bg-purple-400/10"
                    sectionId="proposals"
                />
            </div>

            <AnimatePresence mode="wait">
                {expandedSection && (
                    <motion.div
                        key={expandedSection}
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-white/10 pt-6"
                    >
                        <h4 className="text-sm font-semibold text-white/50 mb-4 uppercase tracking-wider">
                            {getSectionTitle()}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {detailData.length === 0 ? (
                                <p className="text-sm text-gray-400 italic col-span-3 text-center">Nenhum registro encontrado para esta categoria.</p>
                            ) : (
                                detailData.map(consultant => (
                                    <div key={consultant.id} className="bg-white/5 rounded-lg p-4 border border-white/5">
                                        <div className={cn("flex items-center gap-3", consultant.detailItems.length > 0 ? "mb-3 border-b border-white/10 pb-2" : "")}>
                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-white/5">
                                                <img
                                                    src={consultant.photoUrl}
                                                    alt={consultant.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">{consultant.name}</div>
                                                <div className="text-xs text-white/70 font-medium flex items-center gap-1">
                                                    {expandedSection === 'contracts' ? (
                                                        <span className="text-emerald-400">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(consultant.detailValue)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-blue-400 text-lg font-bold">
                                                            {consultant.detailValue}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {consultant.detailItems.length > 0 && (
                                            <ul className="space-y-2">
                                                {consultant.detailItems.map((item) => (
                                                    <li key={item.id} className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-300 truncate mr-2 flex-1" title={item.name}>
                                                            {item.name}
                                                        </span>
                                                        <span className="font-medium text-emerald-400/90 whitespace-nowrap">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value)}
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
