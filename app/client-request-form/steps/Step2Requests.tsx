import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import StepIndicator from "../../../components/form/StepIndicator";
import CategoryBox from "@/components/form/CategoryBox";
import Image from "next/image";

export default function Step2Requests() {

    const steps = [
    { number: 1, label: "Client Info" },
    { number: 2, label: "Requests" },
    { number: 3, label: "Review" },
    ];
    return (
        <ProtectedRoute allow={["Case Manager"]}>
            <div className="space-y-6">
                <div className="flex justify-center mb-8">
                    <Image
                        src="/journey-home-logo.png"
                        alt="Journey Home Logo"
                        height={96}
                        width={350}
                        className="h-24 w-auto"
                    />
                </div>

                <StepIndicator currentStep={2} steps={steps}/>


{/* updateBedding: (bedding: Partial<Bedding>) => void;
  updateTables: (tables: Partial<Tables>) => void;
  updateKitchen: (kitchen: Partial<Kitchen>) => void;
  updateOther: (other: Partial<Other>) => void; */}

                {/* <div className="space-y-6">
                    <CategoryBox
                        categoryName="Bedding"
                        items={[
                            { label: "Twin Beds"},
                            { label: "Full Beds" },
                            { label: "Pillows"},
                        ]}
                    />

                </div> */}
            </div>
        </ProtectedRoute>
    );
}