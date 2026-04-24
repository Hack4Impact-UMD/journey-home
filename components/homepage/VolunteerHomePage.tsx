import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import Navbar from "@/components/general/Navbar";

export default function VolunteerHomePage() {
    return (
        <ProtectedRoute allow={["Volunteer"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <div className="flex flex-1 min-h-0 max-md:flex-col">
                    <Navbar />
                    <div className="flex-1 min-h-0 bg-[#F7F7F7] pt-8 max-md:pt-1 pb-4 px-6 flex flex-col">
                        <span className="text-2xl text-primary font-extrabold block max-md:hidden">
                            Journeying to the Home Page! (Volunteer Home Page)
                        </span>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
