import type { ActivityItem } from "../../types";
import { ProgressBar } from "../ui/ProgressBar";

interface ActivityListProps {
    activities: ActivityItem[];
}

export const ActivityList = ({ activities }: ActivityListProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3 px-1">Atividades Semanais</h3>
            <div className="space-y-3">
                {activities.map((act) => (
                    <div key={act.id} className="group">
                        <div className="flex justify-between items-center mb-1 text-xs sm:text-sm text-gray-200">
                            <span className="font-medium truncate pr-2">{act.label}</span>
                            <span className="font-mono text-white/50 group-hover:text-white transition-colors">
                                <span className={act.realized >= act.scheduled && act.scheduled > 0 ? "text-green-400 font-bold" : ""}>
                                    {act.realized}
                                </span>
                                <span className="mx-1">/</span>
                                {act.scheduled}
                            </span>
                        </div>
                        <ProgressBar value={act.realized} total={act.scheduled} />
                    </div>
                ))}
            </div>
        </div>
    );
};
