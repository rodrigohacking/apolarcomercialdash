export interface FinancialItem {
    id: string;
    name: string;
    value: number;
}

export interface ActivityItem {
    id: string;
    label: string;
    scheduled: number;
    realized: number;
}

export interface Consultant {
    id: string;
    name: string;
    role: string;
    photoUrl?: string; // We'll use placeholders or imports
    financials: FinancialItem[];
    totalFinancial: number;
    activities: ActivityItem[];
}

export interface TeamStats {
    totalContractsValue: number;
    meetingsScheduled: number;
    meetingsRealized: number;
    proposalsSent: number;
}

export interface DashboardData {
    weekRange: string;
    team: Consultant[];
    stats: TeamStats;
}
