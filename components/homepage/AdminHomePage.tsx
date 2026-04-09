import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import AdminCalendarSummary from "./AdminCalendarSummary";
import WarehouseHistorySummary from "./WarehouseHistorySummary";
import { QuickStatsSummary } from "./QuickStatsSummary";
import { PickupsDeliveriesSummary } from "./PickupsDeliveriesSummary";

export default function AdminHomePage() {
    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1 flex flex-col bg-[#F7F7F7] overflow-hidden">
                        
                        <div className = "flex flex-col w-[90%] h-[93%] bg-[#FFFFFF] mx-[2%] mt-[2.5%] rounded-xl">
                            <h1 className = ""> Welcome __! </h1>
                            <div></div>
                            <div className = "flex flex-1">
                                <div className = "flex flex-col items-center gap-4 w-[45%]"> 
                                    <div className = "w-[95%]">
                                    <QuickStatsSummary/>
                                    </div>
                                    <WarehouseHistorySummary/>
                                </div>
                                <div className = "flex flex-col items-center gap-4 flex-1">
                                    <div className = "w-[95%]">
                                    <PickupsDeliveriesSummary/>
                                    </div>
                                    <AdminCalendarSummary/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
