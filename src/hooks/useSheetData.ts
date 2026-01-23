import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import type { DashboardData, FinancialItem, Consultant, ActivityItem, TeamStats } from '../types';
import { MOCK_DATA } from '../data/mock';

// Placeholder URL - User replacement
// @ts-ignore
const _OLD_URL = "";

export const useSheetData = () => {
    const [allWeeksData, setAllWeeksData] = useState<DashboardData[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        // URL provided by user
        const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR9MEtWASLUf0NAULsL95tlVxr4AxGGwOdQHzrH3hTq-R-ZxjYERTm-GMm3h-ma6df_4EKkcMc1TDPo/pub?output=csv";

        setLoading(true);
        try {
            const response = await fetch(CSV_URL);
            const csvText = await response.text();

            Papa.parse(csvText, {
                header: false,
                skipEmptyLines: false,
                complete: (results) => {
                    const rows = results.data as string[][];
                    try {
                        const weeks = parseAllWeeks(rows);

                        if (weeks.length === 0) {
                            setError("Nenhuma semana encontrada. Verifique o layout.");
                            return;
                        }

                        setAllWeeksData(weeks);
                        setCurrentIndex(weeks.length - 1); // Show latest (bottom of sheet) by default
                    } catch (parseErr) {
                        console.error("Parse logic error", parseErr);
                        setError("Erro ao processar as semanas.");
                    }
                },
                error: (err: Error) => {
                    setError(err.message);
                }
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const currentData = allWeeksData[currentIndex] || MOCK_DATA;

    // Actions to navigate available weeks
    const prevWeek = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const nextWeek = () => {
        if (currentIndex < allWeeksData.length - 1) setCurrentIndex(prev => prev + 1);
    };

    return {
        dashboardData: currentData,
        loading,
        error,
        actions: { nextWeek, prevWeek }
    };
};

// --- Parsing Logic for Multiple Blocks ---

function parseAllWeeks(rows: string[][]): DashboardData[] {
    const weeks: DashboardData[] = [];

    // 1. Find all "Atividades Semanais" lines
    const activityIndices: number[] = [];
    rows.forEach((row, idx) => {
        if (row[1]?.includes("Atividades Semanais")) {
            activityIndices.push(idx);
        }
    });

    if (activityIndices.length === 0) return [];

    // 2. Parse each block
    activityIndices.forEach(activitiesRowIndex => {
        weeks.push(parseSingleBlock(rows, activitiesRowIndex));
    });

    return weeks;
}

function parseSingleBlock(rows: string[][], activitiesRowIndex: number): DashboardData {
    // 1. Extract Date Range
    let weekRange = "Semana Indefinida";
    const headerText = rows[activitiesRowIndex][1];
    const parts = headerText.split("-");
    if (parts.length > 1) weekRange = parts[1].trim();

    // Helper
    const parseCurrency = (val: string) => {
        if (!val) return 0;
        const clean = val.replace(/[R$\s.]/g, "").replace(",", ".");
        return parseFloat(clean) || 0;
    };

    // 2. Consultants
    const consultantsConfig = [
        { id: "amanda", name: "Amanda", colIndex: 1, role: "Consultora" },
        { id: "lucas", name: "Lucas", colIndex: 4, role: "Consultor" },
        { id: "robson", name: "Robson", colIndex: 7, role: "Consultor" },
    ];

    const team: Consultant[] = consultantsConfig.map(config => {
        const { colIndex } = config;

        // --- Financials --- 
        const financials: FinancialItem[] = [];
        let totalFinancial = 0;

        let financialStartRow = activitiesRowIndex - 1;
        while (financialStartRow > 0) {
            if (rows[financialStartRow][colIndex] === "Condomínio/Síndico") {
                break;
            }
            financialStartRow--;
            if (activitiesRowIndex - financialStartRow > 30) break;
        }

        for (let i = financialStartRow + 1; i < activitiesRowIndex; i++) {
            const condoName = rows[i][colIndex];
            const valueStr = rows[i][colIndex + 1];

            if (!condoName || condoName.trim() === "") continue;

            const value = parseCurrency(valueStr);
            if (value > 0 || condoName.length > 2) {
                financials.push({
                    id: `fin-${config.id}-${i}-${weekRange}`,
                    name: condoName,
                    value
                });
                totalFinancial += value;
            }
        }

        // --- Activities ---
        const activities: ActivityItem[] = [];
        const activityLabels = [
            "Contratos Fechados",
            "Discador",
            "BOT", "MKT", "Prospec. Ativa",
            "Síndicos Profissionais", "Busca Externa", "Parceria Fechada"
        ];

        activityLabels.forEach((label, idx) => {
            let scheduled = 0;
            let realized = 0;

            const maxSearch = 20;

            if (label === "Contratos Fechados" || label === "Parceria Fechada") {
                const row = rows.slice(activitiesRowIndex, activitiesRowIndex + maxSearch)
                    .find((r) => r[colIndex]?.includes(label));
                if (row) realized = parseInt(row[colIndex + 1]) || 0;
            } else {
                const rowAgendado = rows.slice(activitiesRowIndex, activitiesRowIndex + maxSearch)
                    .find((r) => r[colIndex]?.includes(`${label} Agendado`));
                const rowRealizado = rows.slice(activitiesRowIndex, activitiesRowIndex + maxSearch)
                    .find((r) => r[colIndex]?.includes(`${label} Realizado`));
                if (rowAgendado) scheduled = parseInt(rowAgendado[colIndex + 1]) || 0;
                if (rowRealizado) realized = parseInt(rowRealizado[colIndex + 1]) || 0;
            }

            activities.push({
                id: `act-${config.id}-${idx}-${weekRange}`,
                label: label.replace("Prospec. Ativa", "Prospeção"),
                scheduled,
                realized
            });
        });

        const getPhotoUrl = () => {
            if (config.id === 'amanda') return '/amanda.jpg';
            if (config.id === 'lucas') return '/lucas.jpg';
            if (config.id === 'robson') return '/robson.jpg';
            return `https://api.dicebear.com/7.x/avataaars/svg?seed=${config.name}`;
        };

        return {
            id: config.id,
            name: config.name,
            role: config.role,
            photoUrl: getPhotoUrl(),
            financials,
            totalFinancial,
            activities
        };
    });

    // 3. Team Stats
    const searchScope = rows.slice(activitiesRowIndex, activitiesRowIndex + 40);

    const getValueFromLabel = (searchLabel: string) => {
        const row = searchScope.find(r => r[1]?.includes(searchLabel));
        return row ? (typeof row[2] === 'string' && row[2].includes("R$") ? parseCurrency(row[2]) : parseInt(row[2]) || 0) : 0;
    };

    const stats: TeamStats = {
        totalContractsValue: getValueFromLabel("TOTAL DE VALOR CONTRATOS"),
        meetingsScheduled: getValueFromLabel("TOTAL DE REUNIÕES AGENDADAS"),
        meetingsRealized: getValueFromLabel("TOTAL DE REUNIÕES REALIZADAS"),
        proposalsSent: getValueFromLabel("TOTAL DE PROPOSTAS ENVIADAS")
    };

    return { weekRange, team, stats };
}
