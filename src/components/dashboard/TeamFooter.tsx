import type { TeamStats } from "../../types";
import { Card } from "../ui/Card";
import { Briefcase, CalendarCheck, CalendarDays, Send } from "lucide-react";
import { cn } from "../../lib/utils";

interface TeamFooterProps {
    stats: TeamStats;
}

export const TeamFooter = ({ stats }: TeamFooterProps) => {
    const StatItem = ({
        icon: Icon,
        label,
        value,
        isCurrency = false,
        color = "text-blue-400",
        bgColor = "bg-blue-400/10"
    }: {
        icon: any,
        label: string,
        value: number,
        isCurrency?: boolean,
        color?: string,
        bgColor?: string
    }) => (
        <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-xl", bgColor)}>
                <Icon className={cn("w-5 h-5", color)} />
            </div>
            <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</div>
                <div className="text-lg font-bold text-white">
                    {isCurrency
                        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
                        : value
                    }
                </div>
            </div>
        </div>
    );

    return (
        <Card className="mt-8 !p-4 md:!p-6 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-blue-500/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 cursor-default">
                <StatItem
                    icon={Briefcase}
                    label="Total Contratos"
                    value={stats.totalContractsValue}
                    isCurrency
                    color="text-emerald-400"
                    bgColor="bg-emerald-400/10"
                />
                <StatItem
                    icon={CalendarDays}
                    label="Reuniões Agendadas"
                    value={stats.meetingsScheduled}
                    color="text-amber-400"
                    bgColor="bg-amber-400/10"
                />
                <StatItem
                    icon={CalendarCheck}
                    label="Reuniões Realizadas"
                    value={stats.meetingsRealized}
                    color="text-blue-400"
                    bgColor="bg-blue-400/10"
                />
                <StatItem
                    icon={Send}
                    label="Propostas Enviadas"
                    value={stats.proposalsSent}
                    color="text-purple-400"
                    bgColor="bg-purple-400/10"
                />
            </div>
        </Card>
    );
};
