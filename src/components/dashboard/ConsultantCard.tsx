import { Card } from "../ui/Card";
import type { Consultant } from "../../types";
import { ActivityList } from "./ActivityList";
import { FinancialList } from "./FinancialList";

interface ConsultantCardProps {
    consultant: Consultant;
}

export const ConsultantCard = ({ consultant }: ConsultantCardProps) => {
    return (
        <Card className="h-full flex flex-col">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-cyan-400 to-blue-600 mb-3 shadow-xl">
                        <img
                            src={consultant.photoUrl}
                            alt={consultant.name}
                            className="w-full h-full rounded-full object-cover border-2 border-[#040b28] bg-white"
                        />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                        {consultant.role}
                    </div>
                </div>
                <h2 className="text-xl font-bold text-white mt-1 uppercase tracking-tight">{consultant.name}</h2>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar">
                {/* Financial Section */}
                <FinancialList financials={consultant.financials} total={consultant.totalFinancial} />

                {/* Separator */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

                {/* Activities Section */}
                <ActivityList activities={consultant.activities} />
            </div>
        </Card>
    );
};
