import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";

export default function AdminHomePage() {
    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <div className="flex flex-1 max-md:flex-col">
                    <SideNavbar />
                    <div className="flex-1 bg-[#F7F7F7] pt-8 max-md:pt-1 pb-4 px-6 flex flex-col">
                        <span className="text-2xl text-primary font-extrabold block">
                            Journeying to the Home Page! (Admin Home Page)
                        </span>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
