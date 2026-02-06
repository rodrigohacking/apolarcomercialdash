import type { DashboardData } from "../types";

export const MOCK_DATA: DashboardData = {
    weekRange: "12/01 a 18/01",
    stats: {
        totalContractsValue: 21012.00, // 14282 (Amanda) + 6730 (Lucas)
        meetingsScheduled: 13,         // Amanda (5) + Lucas (8)
        meetingsRealized: 10,          // Amanda (7) + Lucas (3)
        proposalsSent: 7,              // Amanda (4) + Lucas (3)
    },
    team: [
        {
            id: "amanda",
            name: "Amanda",
            role: "Consultora",
            photoUrl: "/amanda.jpg",
            totalFinancial: 14282.00,
            totalSold: 0,
            proposalsSent: 4,
            financials: [
                { id: "1", name: "João Evaristo", value: 4500.00 },
                { id: "2", name: "Luna", value: 2200.00 },
                { id: "3", name: "Versatille", value: 3262.00 },
                { id: "4", name: "Das Flores", value: 1300.00 },
                { id: "5", name: "Modelo III", value: 500.00 },
                { id: "6", name: "Flor da Suissa", value: 1000.00 },
                { id: "7", name: "Fidellis Reginato", value: 1520.00 },
                { id: "8", name: "Marlo", value: 600.00 },
            ],
            activities: [
                { id: "act1", label: "Contratos Fechados", scheduled: 0, realized: 0 },
                { id: "act2", label: "Discador", scheduled: 0, realized: 0 },
                { id: "act3", label: "BOT", scheduled: 2, realized: 2 },
                { id: "act4", label: "MKT", scheduled: 0, realized: 0 },
                { id: "act5", label: "Prospecção Ativa", scheduled: 3, realized: 3 },
                { id: "act6", label: "Síndicos Profissionais", scheduled: 2, realized: 2 },
                { id: "act7", label: "Busca Externa", scheduled: 0, realized: 0 },
            ]
        },
        {
            id: "lucas",
            name: "Lucas",
            role: "Consultor",
            photoUrl: "/lucas.jpg",
            totalFinancial: 6730.00,
            totalSold: 0,
            proposalsSent: 3,
            financials: [
                { id: "1", name: "Antonio Gusi", value: 1500.00 },
                { id: "2", name: "Mediterrâneo", value: 700.00 },
                { id: "3", name: "Green Village", value: 530.00 },
                { id: "4", name: "Los Angeles", value: 1500.00 },
                { id: "5", name: "Jardim dos Pinhais", value: 500.00 },
                { id: "6", name: "San Lorenzo", value: 2000.00 },
            ],
            activities: [
                { id: "act1", label: "Contratos Fechados", scheduled: 0, realized: 0 },
                { id: "act2", label: "Discador", scheduled: 2, realized: 0 },
                { id: "act3", label: "BOT", scheduled: 1, realized: 1 },
                { id: "act4", label: "MKT", scheduled: 1, realized: 1 },
                { id: "act5", label: "Prospecção Ativa", scheduled: 3, realized: 1 },
                { id: "act6", label: "Síndicos Profissionais", scheduled: 1, realized: 1 },
                { id: "act7", label: "Busca Externa", scheduled: 0, realized: 0 },
            ]
        },

    ]
};
