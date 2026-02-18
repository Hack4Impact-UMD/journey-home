import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import StepIndicator from "../../../components/form/StepIndicator";
import CategoryBox from "@/components/form/CategoryBox";
import { useCaseForm } from "../caseContext";
import Image from "next/image";
import { Bedding, Tables,Kitchen, Other } from "../caseContext";
import Button from "../../../components/form/Button";

export default function Step2Requests() {
    const {
        formState,
        updateBedding,
        updateTables,
        updateKitchen,
        updateOther,
        setCurrentStep,
    } = useCaseForm();

    const steps = [
        { number: 1, label: "Client Info" },
        { number: 2, label: "Requests" },
        { number: 3, label: "Review" },
    ];

    const handleBack = () => {
        setCurrentStep(1);
    };

    const handleNext = () => {
        setCurrentStep(3);
    };
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

                <StepIndicator currentStep={2} steps={steps} />

                <CategoryBox<Bedding>
                    categoryName="Bedding"
                    onChange={updateBedding}
                    items={[
                        { label: "Twin Beds", field: "twinbeds", value: formState.bedding.twinbeds },
                        { label: "Full Beds", field: "fullbeds", value: formState.bedding.fullbeds },
                        { label: "Queen Beds", field: "queenbeds", value: formState.bedding.queenbeds },
                        { label: "Sheets", field: "sheets", value: formState.bedding.sheets },
                        { label: "Blanket/Comforter", field: "blanket", value: formState.bedding.blanket },
                        { label: "Pillows", field: "pillows", value: formState.bedding.pillows, description: "(We can only provide 1 per person)"},
                    ]}
                />

                <CategoryBox<Tables>
                    categoryName="Tables"
                    onChange={updateTables}
                    items={[
                        { label: "Sofa/Love Seat", field: "sofa", value: formState.tables.sofa },
                        { label: "Armchair/Recliner", field: "armchair", value: formState.tables.armchair },
                        { label: "Kitchen Chair", field: "kitchenchair", value: formState.tables.kitchenchair },
                        { label: "Kitchen Table", field: "kitchentable", value: formState.tables.kitchentable },
                        { label: "Coffee Table", field: "coffeetable", value: formState.tables.coffeetable },
                        { label: "End Table/Nightstand", field: "endtable", value: formState.tables.endtable },
                    ]}
                    />

                    <CategoryBox<Kitchen>
                        categoryName="Kitchen"
                        onChange={updateKitchen}
                        items={[
                            { label: "Coffee Maker", field: "coffeeMaker", value: formState.kitchen.coffeeMaker },
                            { label: "Toaster", field: "toaster", value: formState.kitchen.toaster },
                            { label: "Microwave", field: "microwave", value: formState.kitchen.microwave },
                            { label: "Pot/pan Set", field: "potset", value: formState.kitchen.potset },
                            { label: "Kitchen Sets", field: "kitchenset", value: formState.kitchen.kitchenset, description: "(includes 4 dishes, glasses, bowls, etc.)"},
                        ]}
                    />

                    <CategoryBox<Other>
                    categoryName="Other"
                    onChange={updateOther}
                    items={[
                        { label: "Dresser", field: "dresser", value: formState.other.dresser },
                        { label: "Fan/AC Unit", field: "fan", value: formState.other.fan },
                        { label: "Heater", field: "heater", value: formState.other.heater },
                        { label: "Area Rug", field: "arearug", value: formState.other.arearug },
                        { label: "Towel Set", field: "towelset", value: formState.other.towelset },
                        { label: "Lamp", field: "lamp", value: formState.other.lamp },
                    ]}
                    />

                    <div className="flex justify-center gap-4 mt-8">
                        <Button
                            onClick={handleBack}
                            variant="secondary"
                            className="min-w-80"
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            variant="primary"
                            className="min-w-80"
                        >
                            Next
                        </Button>
                    </div>
            </div>
        </ProtectedRoute>
    );
}
