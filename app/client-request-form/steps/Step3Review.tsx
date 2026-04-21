"use client";
import StepIndicator from "../../../components/form/StepIndicator";
import Image from "next/image";
import { useCaseForm } from "../caseContext";
import { useState } from "react";
import Button from "@/components/form/Button";
import { Timestamp } from "firebase/firestore";
import { ClientRequest, ItemRequest } from "@/types/client-requests";
import { createClientRequest } from "@/lib/services/clientRequests";
import { getAuth } from "firebase/auth";
import { Spinner } from "@/components/ui/spinner";

export default function Step3Review() {
    const auth = getAuth();
    const { formState, setCurrentStep } = useCaseForm();

    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const client = formState.clientInfoAndNewHome;
    const questions = client.questions;
    const address = client.address;

    const handleBack = () => {
        setCurrentStep(2);
    };

    const formatDate = (timestamp?: Timestamp) => {
        if (!timestamp) return "";
        return new Date(timestamp.toMillis()).toLocaleDateString();
    };

    const renderBoolean = (value?: boolean) => {
        if (value === true) return "Yes";
        if (value === false) return "No";
        return "Not specified";
    };

    const handleSubmit = async () => {
        try {
            const items: ItemRequest[] = [
                { name: "Twin bed", quantity: formState.bedding.twinbeds },
                { name: "Full bed", quantity: formState.bedding.fullbeds },
                { name: "Queen bed", quantity: formState.bedding.queenbeds },
                { name: "Sheets", quantity: formState.bedding.sheets },
                {
                    name: "Blanket/Comforter",
                    quantity: formState.bedding.blanket,
                },
                { name: "Pillow", quantity: formState.bedding.pillows },

                { name: "Sofa/Loveseat", quantity: formState.tables.sofa },
                {
                    name: "Armchair/Recliner",
                    quantity: formState.tables.armchair,
                },
                {
                    name: "Kitchen chair",
                    quantity: formState.tables.kitchenchair,
                },
                {
                    name: "Kitchen table",
                    quantity: formState.tables.kitchentable,
                },
                {
                    name: "Coffee table",
                    quantity: formState.tables.coffeetable,
                },
                {
                    name: "End table/Night stand",
                    quantity: formState.tables.endtable,
                },

                {
                    name: "Coffee maker",
                    quantity: formState.kitchen.coffeeMaker,
                },
                { name: "Toaster", quantity: formState.kitchen.toaster },
                { name: "Microwave", quantity: formState.kitchen.microwave },
                { name: "Pot/pan set", quantity: formState.kitchen.potset },
                { name: "Kitchen set", quantity: formState.kitchen.kitchenset },

                { name: "Dresser", quantity: formState.other.dresser },
                { name: "Fan/AC unit", quantity: formState.other.fan },
                { name: "Heater", quantity: formState.other.heater },
                { name: "Area rug", quantity: formState.other.arearug },
                { name: "Towel set", quantity: formState.other.towelset },
                { name: "Lamp", quantity: formState.other.lamp },
            ].filter((item) => item.quantity > 0);

            const uid = auth.currentUser?.uid;
            if (!uid) {
                alert("You must be logged in to submit a request.");
                return;
            }
            const request: ClientRequest = {
                id: crypto.randomUUID(),
                client,
                caseManagerID: uid,
                notes: client.questions.notes ?? "",
                status: "Not Reviewed",
                associatedTimeBlockID: null,
                date: Timestamp.now(),
                items,
            };

            await createClientRequest(request);

            setCurrentStep(4);
        } catch (error) {
            console.error(error);
            alert("There was an issue submitting this request.");
        }
    };

    const steps = [
        { number: 1, label: "Client Info" },
        { number: 2, label: "Requests" },
        { number: 3, label: "Review" },
    ];

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

                <StepIndicator currentStep={3} steps={steps} />

                <h2 className="text-2xl font-bold text-gray-900">
                    Client Info
                </h2>

                <div className="border border-gray-300 rounded p-6 space-y-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Client</h3>
                        <div className="grid grid-cols-2 gap-y-4">
                            <div className="font-semibold">Name</div>
                            <div>
                                {client.firstName} {client.lastName}
                            </div>

                            <div className="font-semibold">HMIS number</div>
                            <div>{client.hmis}</div>

                            <div className="font-semibold">Program name</div>
                            <div>{client.programName}</div>

                            <div className="font-semibold">
                                Client phone number
                            </div>
                            <div>{client.phoneNumber}</div>

                            <div className="font-semibold">
                                Secondary contact number
                            </div>
                            <div>{client.secondaryContact?.phone}</div>

                            <div className="font-semibold">
                                Name of Secondary contact
                            </div>
                            <div>{client.secondaryContact?.name}</div>

                            <div className="font-semibold">
                                Secondary Contact relationship
                            </div>
                            <div>{client.secondaryContact?.relationship}</div>

                            <div className="font-semibold">
                                Does the client speak/understand English
                            </div>
                            <div>
                                {renderBoolean(questions.clientSpeaksEnglish)}
                            </div>

                            <div className="font-semibold">
                                Adults in family
                            </div>
                            <div>{questions.adultsInFamily}</div>

                            <div className="font-semibold">
                                Children in family
                            </div>
                            <div>{questions.childrenInFamily}</div>

                            <div className="font-semibold">
                                Is the client a veteran?
                            </div>
                            <div>{renderBoolean(questions.isVeteran)}</div>

                            <div className="font-semibold">
                                Can pick up at warehouse?
                            </div>
                            <div>{renderBoolean(questions.canPickUp)}</div>

                            <div className="font-semibold">
                                Was chronic before housing?
                            </div>
                            <div>{renderBoolean(questions.wasChronic)}</div>

                            <div className="font-semibold">Moved in?</div>
                            <div>{renderBoolean(questions.hasMovedIn)}</div>

                            <div className="font-semibold">Move-in date</div>
                            <div>{formatDate(questions.moveInDate)}</div>

                            <div className="font-semibold">Notes</div>
                            <div>{questions.notes}</div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4">
                            Client&apos;s New Home
                        </h3>

                        <div className="grid grid-cols-2 gap-y-4">
                            <div className="font-semibold">Address</div>
                            <div>
                                {address.streetAddress}, {address.city} CT{" "}
                                {address.zipCode}
                            </div>

                            <div className="font-semibold">Apt / Unit</div>
                            <div>{address.apt}</div>

                            <div className="font-semibold">
                                Working elevator?
                            </div>
                            <div>{renderBoolean(questions.hasElevator)}</div>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900">Requests</h2>

                <div className="border border-gray-300 rounded p-6">
                    {formState && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
                            {[
                                {
                                    label: "Twin Beds",
                                    value: formState.bedding.twinbeds,
                                },
                                {
                                    label: "Full Beds",
                                    value: formState.bedding.fullbeds,
                                },
                                {
                                    label: "Queen Beds",
                                    value: formState.bedding.queenbeds,
                                },
                                {
                                    label: "Sheets",
                                    value: formState.bedding.sheets,
                                },
                                {
                                    label: "Blanket/Comforter",
                                    value: formState.bedding.blanket,
                                },
                                {
                                    label: "Pillows",
                                    value: formState.bedding.pillows,
                                },
                            ]
                                .filter((item) => item.value > 0)
                                .map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex justify-between p-2"
                                    >
                                        <span className="font-bold">
                                            {item.label}
                                        </span>
                                        <span>{item.value}</span>
                                    </div>
                                ))}

                            {[
                                {
                                    label: "Sofa/Love Seat",
                                    value: formState.tables.sofa,
                                },
                                {
                                    label: "Armchair/Recliner",
                                    value: formState.tables.armchair,
                                },
                                {
                                    label: "Kitchen Chair",
                                    value: formState.tables.kitchenchair,
                                },
                                {
                                    label: "Kitchen Table",
                                    value: formState.tables.kitchentable,
                                },
                                {
                                    label: "Coffee Table",
                                    value: formState.tables.coffeetable,
                                },
                                {
                                    label: "End Table/Nightstand",
                                    value: formState.tables.endtable,
                                },
                            ]
                                .filter((item) => item.value > 0)
                                .map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex justify-between p-2"
                                    >
                                        <span className="font-bold">
                                            {item.label}
                                        </span>
                                        <span>{item.value}</span>
                                    </div>
                                ))}

                            {[
                                {
                                    label: "Coffee Maker",
                                    value: formState.kitchen.coffeeMaker,
                                },
                                {
                                    label: "Toaster",
                                    value: formState.kitchen.toaster,
                                },
                                {
                                    label: "Microwave",
                                    value: formState.kitchen.microwave,
                                },
                                {
                                    label: "Pot/pan Set",
                                    value: formState.kitchen.potset,
                                },
                                {
                                    label: "Kitchen Sets",
                                    value: formState.kitchen.kitchenset,
                                },
                            ]
                                .filter((item) => item.value > 0)
                                .map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex justify-between p-2"
                                    >
                                        <span className="font-bold">
                                            {item.label}
                                        </span>
                                        <span>{item.value}</span>
                                    </div>
                                ))}

                            {[
                                {
                                    label: "Dresser",
                                    value: formState.other.dresser,
                                },
                                {
                                    label: "Fan/AC Unit",
                                    value: formState.other.fan,
                                },
                                {
                                    label: "Heater",
                                    value: formState.other.heater,
                                },
                                {
                                    label: "Area Rug",
                                    value: formState.other.arearug,
                                },
                                {
                                    label: "Towel Set",
                                    value: formState.other.towelset,
                                },
                                { label: "Lamp", value: formState.other.lamp },
                            ]
                                .filter((item) => item.value > 0)
                                .map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex justify-between p-2"
                                    >
                                        <span className="font-bold">
                                            {item.label}
                                        </span>
                                        <span>{item.value}</span>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-4 mt-8">
                    <Button
                        onClick={handleBack}
                        variant="secondary"
                        className="min-w-80"
                    >
                        Back
                    </Button>

                    <Button
                        onClick={async () => {
                            if (!submitLoading) {
                                setSubmitLoading(true);
                                await handleSubmit();
                                setSubmitLoading(false);
                            }
                        }}
                        variant="primary"
                        className="min-w-80"
                        disabled={submitLoading}
                    >
                        Submit {submitLoading && <Spinner className="text-white inline"/>}
                    </Button>
                </div>
        </div>
    );
}