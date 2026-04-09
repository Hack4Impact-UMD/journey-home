import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import AdminCalendarSummary from "./AdminCalendarSummary";
import WarehouseHistorySummary from "./WarehouseHistorySummary";
import { QuickStatsSummary } from "./QuickStatsSummary";
import { PickupsDeliveriesSummary } from "./PickupsDeliveriesSummary";
import { useAuth } from "@/contexts/AuthContext";



export default function AdminHomePage() {
    const auth = useAuth();
    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1 flex flex-col bg-[#F7F7F7] overflow-hidden">
                        
                        <div className = "flex flex-col w-[95%] h-[93%] bg-[#FFFFFF] mx-[2.5%] mt-[2.5%] rounded-xl">
                            <h1 className = "font-extrabold text-5xl ml-[2rem] mt-[2rem] mb-[1rem] text-[#02AFC7]"> Welcome, {auth.state.userData?.firstName}! </h1>
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
