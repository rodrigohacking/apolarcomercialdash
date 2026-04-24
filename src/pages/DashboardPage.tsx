import { motion } from "framer-motion";
import { Header } from "../components/dashboard/Header";
import { ConsultantCard } from "../components/dashboard/ConsultantCard";
import { TeamFooter } from "../components/dashboard/TeamFooter";
import { useSheetData } from "../hooks/useSheetData";

export const DashboardPage = () => {
    const { dashboardData, loading, actions, availableWeeks } = useSheetData();

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center text-white">
                <div className="animate-pulse">Carregando dados...</div>
            </div>
        );
    }

    if (!dashboardData) {
        return <div className="text-white p-8">Carregando dados da planilha...</div>;
    }

    const { weekRange, team, stats } = dashboardData;
    return (
        <div className="min-h-screen bg-primary text-white font-sans p-4 md:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-primary to-primary overflow-x-hidden">
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

                {/* Animated Background Overlay */}
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-30 animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0deg,rgba(4,11,40,0.5)_180deg,transparent_360deg)]" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
                </div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {team.map((consultant, index) => (
                        <motion.div
                            key={consultant.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                        >
                            <ConsultantCard consultant={consultant} />
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
