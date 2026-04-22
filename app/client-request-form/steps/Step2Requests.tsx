"use client";

import StepIndicator from "../../../components/form/StepIndicator";
import CategoryBox from "@/components/form/CategoryBox";
import { useCaseForm } from "../caseContext";
import Image from "next/image";
import { Bedding, Tables, Kitchen, Other } from "../caseContext";
import { PlusIcon } from "lucide-react";
import Button from "../../../components/form/Button";

export default function Step2Requests() {
    const {
        formState,
        updateBedding,
        updateTables,
        updateKitchen,
        updateOther,
        addCustomItem,
        updateCustomItem,
        removeCustomItem,
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
                    footer={
                        <div className="bg-white">
                            {formState.customItems.map((item) => (
                                <div key={item.id} className="grid grid-cols-2 px-4 py-2">
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="text"
                                            placeholder="Item name"
                                            value={item.name}
                                            onChange={(e) => updateCustomItem(item.id, { name: e.target.value })}
                                            className="flex-1 border border-[#D9D9D9] rounded px-2 py-1"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeCustomItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 text-lg leading-none cursor-pointer px-1"
                                            aria-label="Remove item"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <input
                                            type="number"
                                            min={0}
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const parsed = Number(e.target.value);
                                                updateCustomItem(item.id, { quantity: isNaN(parsed) ? 0 : Math.max(0, parsed) });
                                            }}
                                            className="w-70 border border-[#D9D9D9] rounded px-2 py-1 text-right"
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="px-4 py-3 flex justify-center">
                                <button
                                    type="button"
                                    onClick={addCustomItem}
                                    className="flex items-center gap-1.5 px-4 py-1.5 border border-[#D9D9D9] rounded bg-white text-sm text-gray-800 hover:bg-gray-50 cursor-pointer"
                                >
                                    <PlusIcon className="h-4 w-4" />
                                    Custom Item
                                </button>
                            </div>
                        </div>
                    }
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
    );
}
