import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../components/dashboard/Header";
import { ConsultantCard } from "../components/dashboard/ConsultantCard";
import { TeamFooter } from "../components/dashboard/TeamFooter";
import { useSheetData } from "../hooks/useSheetData";

export const DashboardPage = () => {
    const { dashboardData, loading, actions, availableWeeks } = useSheetData();
    const { weekRange, team, stats } = dashboardData;
    const [activeTab, setActiveTab] = useState<string>("amanda");

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

                {/* Animated Background Overlay */}
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-30 animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0deg,rgba(4,11,40,0.5)_180deg,transparent_360deg)]" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto mb-8">
                    <div className="flex p-1 space-x-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                        {team.map((consultant) => (
                            <button
                                key={consultant.id}
                                onClick={() => setActiveTab(consultant.id)}
                                className={`
                                    flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ease-out flex items-center justify-center gap-2
                                    ${activeTab === consultant.id 
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/50 scale-[1.02]' 
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
                                `}
                            >
                                {consultant.id === 'amanda' ? (
                                    <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                                        <img src={consultant.photoUrl} alt={consultant.name} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 bg-slate-800 flex items-center justify-center">
                                        <span className="text-xs">🏢</span>
                                    </div>
                                )}
                                {consultant.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">
                        {team.map((consultant) => (
                            consultant.id === activeTab && (
                                <motion.div
                                    key={consultant.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 25,
                                    }}
                                >
                                    <ConsultantCard consultant={consultant} />
                                </motion.div>
                            )
                        ))}
                    </AnimatePresence>
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
