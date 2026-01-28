import { motion } from "framer-motion";
import { Header } from "../components/dashboard/Header";
import { ConsultantCard } from "../components/dashboard/ConsultantCard";
import { TeamFooter } from "../components/dashboard/TeamFooter";
import { useSheetData } from "../hooks/useSheetData";

export const DashboardPage = () => {
    const { dashboardData, loading, actions, availableWeeks } = useSheetData();
    const { weekRange, team, stats } = dashboardData;

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center text-white">
                <div className="animate-pulse">Carregando dados...</div>
            </div>
        );
    }

    if (dashboardData === undefined) {
        // Should not happen due to fallback, but good safety
        return <div className="text-white p-8">Erro crítico: Dados não disponíveis.</div>;
    }

    return (
        <div className="min-h-screen bg-primary text-white font-sans p-4 md:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-primary to-primary overflow-x-hidden">
            {/* Error Banner */}
            {/* We will just verify availability of availableWeeks and log errors for now or show a small alert */}

            <div className="max-w-7xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Header
                        weekRange={weekRange}
                        availableWeeks={availableWeeks}
                        currentWeekIndex={availableWeeks.findIndex(w => w.label === weekRange)}
                        onWeekSelect={actions.setWeek}
                        onNext={actions.nextWeek}
                        onPrev={actions.prevWeek}
                        onRefresh={actions.refetch}
                    />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
                    {team.map((consultant, index) => (
                        <motion.div
                            key={consultant.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                            className="h-full"
                        >
                            <ConsultantCard
                                consultant={consultant}
                            />
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <TeamFooter stats={stats} team={team} />
                </motion.div>
            </div>
        </div>
    );
};
