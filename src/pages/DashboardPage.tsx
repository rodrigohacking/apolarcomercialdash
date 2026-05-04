import { motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Header } from "../components/dashboard/Header";
import { ConsultantCard } from "../components/dashboard/ConsultantCard";
import { TeamFooter } from "../components/dashboard/TeamFooter";
import { useSheetData } from "../hooks/useSheetData";
import { useAuth } from "../contexts/AuthContext";

export const DashboardPage = () => {
  const {
    dashboardData,
    loading,
    error,
    lastUpdated,
    isUsingMockData,
    actions,
    availableWeeks,
  } = useSheetData();
  const { weekRange, team, stats } = dashboardData;
  const { session } = useAuth();

  const isFirstLoad = loading && availableWeeks.length === 0;

  if (isFirstLoad) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#040b28] text-white">
        <div className="absolute inset-0 bg-radial-spotlight pointer-events-none" />
        <div className="absolute inset-0 bg-grid opacity-[0.18] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        <div className="relative flex min-h-screen flex-col items-center justify-center gap-3">
          <Loader2 className="text-blue-400 animate-spin" size={28} />
          <span className="text-sm text-white/55 tracking-wide">
            Carregando dados da planilha...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#040b28] text-white font-sans">
      <div className="pointer-events-none absolute inset-0 bg-radial-spotlight" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[80vw] max-w-[1200px] rounded-full bg-blue-500/15 blur-3xl" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Header
            weekRange={weekRange}
            availableWeeks={availableWeeks}
            currentWeekIndex={availableWeeks.findIndex(
              (w) => w.label === weekRange,
            )}
            onWeekSelect={actions.setWeek}
            onNext={actions.nextWeek}
            onPrev={actions.prevWeek}
            onRefresh={actions.refetch}
            refreshing={loading}
            lastUpdated={lastUpdated}
            userEmail={session?.user?.email ?? null}
          />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-100"
          >
            <AlertTriangle
              size={18}
              className="shrink-0 mt-0.5 text-amber-300"
            />
            <div>
              <div className="font-semibold text-amber-200">
                Não foi possível atualizar os dados
              </div>
              <div className="text-amber-100/85">
                {error}
                {isUsingMockData &&
                  " Exibindo dados de demonstração enquanto a planilha não responde."}
              </div>
            </div>
          </motion.div>
        )}

        <div
          className={`relative grid grid-cols-1 gap-5 ${
            team.length === 1
              ? "md:grid-cols-1 max-w-2xl mx-auto"
              : team.length === 2
                ? "md:grid-cols-2"
                : "md:grid-cols-2 xl:grid-cols-3"
          }`}
        >
          {team.map((consultant, index) => (
            <motion.div
              key={consultant.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.1 + index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full"
            >
              <ConsultantCard consultant={consultant} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <TeamFooter stats={stats} team={team} />
        </motion.div>

        <footer className="flex items-center justify-between text-[11px] text-white/35 px-1 pt-2">
          <span>
            {lastUpdated
              ? `Atualizado às ${lastUpdated.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Pronto"}
          </span>
          <span>Apolar Comercial · Painel interno</span>
        </footer>
      </main>
    </div>
  );
};
