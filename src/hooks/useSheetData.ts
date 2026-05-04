import { useCallback, useEffect, useState } from "react";
import Papa from "papaparse";
import type {
  ActivityItem,
  Consultant,
  DashboardData,
  FinancialItem,
  TeamStats,
} from "../types";
import { MOCK_DATA } from "../data/mock";

const CSV_BASE_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR9MEtWASLUf0NAULsL95tlVxr4AxGGwOdQHzrH3hTq-R-ZxjYERTm-GMm3h-ma6df_4EKkcMc1TDPo/pub?output=csv";

export const useSheetData = () => {
  const [allWeeksData, setAllWeeksData] = useState<DashboardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const url = `${CSV_BASE_URL}&t=${Date.now()}`;

    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(
          `Falha ao buscar a planilha (HTTP ${response.status}). Verifique se a publicação do Google Sheets está ativa.`,
        );
      }
      const csvText = await response.text();

      Papa.parse<string[]>(csvText, {
        header: false,
        skipEmptyLines: false,
        complete: (results) => {
          try {
            const weeks = parseAllWeeks(results.data as string[][]);
            if (weeks.length === 0) {
              setError(
                "Nenhuma semana encontrada na planilha. Verifique o layout do Google Sheets.",
              );
            } else {
              setAllWeeksData(weeks);
              setCurrentIndex(0);
              setLastUpdated(new Date());
            }
          } catch (parseErr) {
            console.error("Erro de parsing:", parseErr);
            setError("Erro ao processar as semanas da planilha.");
          } finally {
            setLoading(false);
          }
        },
        error: (err: Error) => {
          setError(err.message);
          setLoading(false);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const currentData =
    allWeeksData[currentIndex] ?? (allWeeksData.length === 0 ? MOCK_DATA : MOCK_DATA);

  const prevWeek = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const nextWeek = () => {
    setCurrentIndex((prev) => Math.min(allWeeksData.length - 1, prev + 1));
  };

  return {
    dashboardData: currentData,
    loading,
    error,
    lastUpdated,
    isUsingMockData: allWeeksData.length === 0,
    actions: {
      nextWeek,
      prevWeek,
      setWeek: setCurrentIndex,
      refetch: fetchData,
    },
    availableWeeks: allWeeksData.map((d, index) => ({
      label: d.weekRange,
      index,
    })),
  };
};

// ---------- Parsing ----------

function parseAllWeeks(rows: string[][]): DashboardData[] {
  const weeks: DashboardData[] = [];

  const activityIndices: number[] = [];
  rows.forEach((row, idx) => {
    if (row[0]?.toLowerCase().includes("atividades semanais")) {
      activityIndices.push(idx);
    }
  });

  if (activityIndices.length === 0) return [];

  activityIndices.forEach((activitiesRowIndex) => {
    weeks.push(parseSingleBlock(rows, activitiesRowIndex));
  });

  return weeks;
}

function parseSingleBlock(
  rows: string[][],
  activitiesRowIndex: number,
): DashboardData {
  let weekRange = "Semana Indefinida";
  const headerText = rows[activitiesRowIndex][0] ?? "";
  const parts = headerText.split("-");
  if (parts.length > 1) weekRange = parts[1].trim();

  const parseCurrency = (val: string | undefined) => {
    if (!val) return 0;
    const clean = val.replace(/[R$\s.]/g, "").replace(",", ".");
    return parseFloat(clean) || 0;
  };

  const consultantsConfig = [
    { id: "amanda", name: "Amanda", colIndex: 0, role: "Consultora" },
    { id: "outros", name: "Outros condomínios", colIndex: 4, role: "Equipe" },
  ];

  const team: Consultant[] = consultantsConfig.map((config) => {
    const { colIndex } = config;

    const financials: FinancialItem[] = [];
    let totalFinancial = 0;
    let totalSold = 0;

    let financialStartRow = activitiesRowIndex - 1;
    while (financialStartRow > 0) {
      if (rows[financialStartRow]?.[colIndex] === "Condomínio/Síndico") break;
      financialStartRow--;
      if (activitiesRowIndex - financialStartRow > 30) break;
    }

    let itemsSold = 0;

    for (let i = financialStartRow + 1; i < activitiesRowIndex; i++) {
      const condoName = rows[i]?.[colIndex];
      const valueStr = rows[i]?.[colIndex + 1];
      const soldStr = rows[i]?.[colIndex + 2];

      if (!condoName || condoName.trim() === "") continue;
      if (condoName.trim().toUpperCase().startsWith("TOTAL")) continue;

      const value = parseCurrency(valueStr);
      const soldClean = soldStr?.trim().toUpperCase();
      const isSold = soldClean === "TRUE" || soldClean === "VERDADEIRO";

      if (value > 0 || condoName.length > 2) {
        financials.push({
          id: `fin-${config.id}-${i}-${weekRange}`,
          name: condoName,
          value,
          sold: isSold,
        });

        if (isSold) {
          totalSold += value;
          itemsSold++;
        } else {
          totalFinancial += value;
        }
      }
    }

    const activities: ActivityItem[] = [];
    const activityLabels = [
      "Contratos Fechados",
      "Reuniões",
      "Discador",
      "BOT",
      "MKT",
      "Prospec. Ativa",
      "Síndicos Profissionais",
      "Busca Externa",
      "Parceria Fechada",
    ];

    activityLabels.forEach((label, idx) => {
      let scheduled = 0;
      let realized = 0;
      const maxSearch = 20;

      if (label === "Contratos Fechados") {
        realized = itemsSold;
        scheduled = itemsSold;
      } else if (label === "Parceria Fechada") {
        const row = rows
          .slice(activitiesRowIndex, activitiesRowIndex + maxSearch)
          .find((r) => r[colIndex]?.includes(label));
        if (row) realized = parseInt(row[colIndex + 1]) || 0;
      } else {
        const rowAgendado = rows
          .slice(activitiesRowIndex, activitiesRowIndex + maxSearch)
          .find((r) => {
            const cell = r[colIndex]?.toLowerCase() || "";
            return (
              cell.includes(label.toLowerCase()) &&
              (cell.includes("agendado") || cell.includes("agendada"))
            );
          });

        const rowRealizado = rows
          .slice(activitiesRowIndex, activitiesRowIndex + maxSearch)
          .find((r) => {
            const cell = r[colIndex]?.toLowerCase() || "";
            return (
              cell.includes(label.toLowerCase()) &&
              (cell.includes("realizado") || cell.includes("realizada"))
            );
          });

        if (rowAgendado) scheduled = parseInt(rowAgendado[colIndex + 1]) || 0;
        if (rowRealizado) realized = parseInt(rowRealizado[colIndex + 1]) || 0;
      }

      activities.push({
        id: `act-${config.id}-${idx}-${weekRange}`,
        label: label.replace("Prospec. Ativa", "Prospecção"),
        scheduled,
        realized,
      });
    });

    const proposalsSent = 0;

    const getPhotoUrl = () => {
      if (config.id === "amanda") return "/amanda.jpg";
      if (config.id === "outros")
        return "https://api.dicebear.com/7.x/shapes/svg?seed=outros";
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${config.name}`;
    };

    return {
      id: config.id,
      name: config.name,
      role: config.role,
      photoUrl: getPhotoUrl(),
      financials,
      totalFinancial,
      totalSold,
      proposalsSent,
      activities,
    };
  });

  let totalProposals = 0;
  const searchLimit = 50;
  const proposalsRow = rows
    .slice(activitiesRowIndex, activitiesRowIndex + searchLimit)
    .find((r) => r[0]?.toUpperCase().includes("TOTAL DE PROPOSTAS ENVIADAS"));

  if (proposalsRow) totalProposals = parseInt(proposalsRow[1]) || 0;

  const globalMeetingsRow = rows
    .slice(activitiesRowIndex, activitiesRowIndex + searchLimit)
    .find((r) => r[0]?.toUpperCase().includes("TOTAL DE REUNIÕES"));

  let globalScheduled = team.reduce(
    (acc, curr) =>
      acc +
      curr.activities.reduce(
        (s, a) => s + (a.label === "Reuniões" ? a.scheduled : 0),
        0,
      ),
    0,
  );
  let globalRealized = team.reduce(
    (acc, curr) =>
      acc +
      curr.activities.reduce(
        (s, a) => s + (a.label === "Reuniões" ? a.realized : 0),
        0,
      ),
    0,
  );

  if (globalMeetingsRow) {
    const valScheduled = parseInt(globalMeetingsRow[1]) || 0;
    const valRealized = parseInt(globalMeetingsRow[2]) || 0;
    if (valScheduled > 0) globalScheduled = valScheduled;
    if (valRealized > 0) globalRealized = valRealized;
  }

  const stats: TeamStats = {
    totalContractsValue: team.reduce((acc, curr) => acc + curr.totalSold, 0),
    meetingsScheduled: globalScheduled,
    meetingsRealized: globalRealized,
    proposalsSent: totalProposals,
  };

  return { weekRange, team, stats };
}
