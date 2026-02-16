import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import StepIndicator from "../../../components/form/StepIndicator";
import Image from "next/image";

export default function Step3Review() {

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

                <StepIndicator currentStep={3} steps={steps}/>

                <div className="md:col-span-2 space-y-6">

                </div>
            </div>
        </ProtectedRoute>
    );
}
