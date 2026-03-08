"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import StepIndicator from "../../../components/form/StepIndicator";
import FormInput from "../../../components/form/FormInput";
import FormSelect from "../../../components/form/FormSelect";
import Button from "../../../components/form/Button";
import { useState } from "react";
import { useCaseForm } from "../caseContext";
import Image from "next/image";
import { Timestamp } from "firebase/firestore";

export default function Step1ClientInfo() {
    const {
        formState,
        updateClientInfo,
        updateClientQuestions,
        updateSecondaryContact,
        setCurrentStep,
    } = useCaseForm();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        const client = formState.clientInfoAndNewHome;

        if (!client.firstName) newErrors.firstName = "First name is required";
        if (!client.lastName) newErrors.lastName = "Last name is required";
        if (!client.hmis) newErrors.hmis = "HMIS number is required";
        if (!client.phoneNumber)
            newErrors.phoneNumber = "Client Phone number is required";
        else if (!/^\d{3}-\d{3}-\d{4}$/.test(client.phoneNumber))
            newErrors.phoneNumber = "Enter a valid 10-digit phone number (e.g. 555-867-5309)";

        if (
            client.questions.adultsInFamily === undefined ||
            client.questions.adultsInFamily < 0
        )
            newErrors.adultsInFamily = "Adults in family is required";
        if (
            client.questions.childrenInFamily === undefined ||
            client.questions.childrenInFamily < 0
        )
            newErrors.childrenInFamily = "Children in family is required";
        if (client.questions.isVeteran === undefined)
            newErrors.isVeteran = "Please select if client is a veteran";
        if (client.questions.canPickUp === undefined)
            newErrors.canPickUp = "Please select pickup option";
        if (client.questions.wasChronic === undefined)
            newErrors.wasChronic = "Please select chronic homelessness option";
        if (client.questions.hasMovedIn === undefined)
            newErrors.hasMovedIn = "Please select move-in status";
        if (
            client.questions.hasMovedIn &&
            client.questions.moveInDate === undefined
        )
            newErrors.moveInDate = "Please select move-in date";

        if (!client.address?.streetAddress)
            newErrors.streetAddress = "Street address is required";
        if (!client.address?.city) newErrors.city = "City is required";
        if (!client.address?.zipCode)
            newErrors.zipCode = "Zip code is required";
        if (client.questions.hasElevator === undefined)
            newErrors.hasElevator = "Please select elevator option";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setCurrentStep(2);
        }
    };

    const cityOptions = [
        "Avon",
        "Bloomfield",
        "Canton",
        "East Granby",
        "East Hartford",
        "East Windsor",
        "Farmington",
        "Glastonbury",
        "Granby",
        "Hartford",
        "Manchester",
        "Newington",
        "Rocky Hill",
        "Simsbury",
        "South Windsor",
        "Vernon",
        "West Hartford",
        "Wethersfield",
        "Windsor",
        "Windsor Locks",
    ];

    const steps = [
        { number: 1, label: "Client Info" },
        { number: 2, label: "Requests" },
        { number: 3, label: "Review" },
    ];

    const clearError = (field: keyof typeof errors) => {
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
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

                <StepIndicator currentStep={1} steps={steps} />

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Client Info
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <FormInput
                                label="First Name"
                                required
                                value={
                                    formState.clientInfoAndNewHome.firstName ||
                                    ""
                                }
                                onChange={(e) => {
                                    updateClientInfo({
                                        firstName: e.target.value,
                                    });
                                    if (errors.firstName)
                                        setErrors({ ...errors, firstName: "" });
                                }}
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.firstName}
                                </p>
                            )}
                        </div>
                        <div>
                            <FormInput
                                label="Last Name"
                                required
                                value={
                                    formState.clientInfoAndNewHome.lastName ||
                                    ""
                                }
                                onChange={(e) => {
                                    updateClientInfo({
                                        lastName: e.target.value,
                                    });
                                    if (errors.lastName)
                                        setErrors({ ...errors, lastName: "" });
                                }}
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.lastName}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            <FormInput
                                label="HMIS Number"
                                required
                                value={
                                    formState.clientInfoAndNewHome.hmis ?? ""
                                }
                                onChange={(e) => {
                                    updateClientInfo({ hmis: e.target.value });
                                    clearError("hmis");
                                }}
                            />
                            {errors.hmis && (
                                <p className="text-red-500 text-sm">
                                    {errors.hmis}
                                </p>
                            )}

                            <FormInput
                                label="Client Phone Number"
                                required
                                type="tel"
                                value={
                                    formState.clientInfoAndNewHome
                                        .phoneNumber ?? ""
                                }
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /\D/g,
                                        "",
                                    );
                                    const formatted = value
                                        .replace(
                                            /(\d{3})(\d{3})(\d{4})/,
                                            "$1-$2-$3",
                                        )
                                        .slice(0, 12);

                                    updateClientInfo({
                                        phoneNumber: formatted,
                                    });

                                    clearError("phoneNumber");
                                }}
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-500 text-sm">
                                    {errors.phoneNumber}
                                </p>
                            )}

                            <FormInput
                                label="Secondary Contact Phone Number"
                                type="tel"
                                value={
                                    formState.clientInfoAndNewHome
                                        .secondaryContact?.phone ?? ""
                                }
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /\D/g,
                                        "",
                                    );
                                    const formatted = value
                                        .replace(
                                            /(\d{3})(\d{3})(\d{4})/,
                                            "$1-$2-$3",
                                        )
                                        .slice(0, 12);

                                    updateSecondaryContact({
                                        phone: formatted,
                                    });
                                }}
                            />

                            <FormInput
                                label="Secondary Contact Name"
                                value={
                                    formState.clientInfoAndNewHome
                                        .secondaryContact?.name ?? ""
                                }
                                onChange={(e) =>
                                    updateSecondaryContact({
                                        name: e.target.value,
                                    })
                                }
                            />

                            <FormInput
                                label="Secondary Contact Relationship to Client"
                                value={
                                    formState.clientInfoAndNewHome
                                        .secondaryContact?.relationship ?? ""
                                }
                                onChange={(e) =>
                                    updateSecondaryContact({
                                        relationship: e.target.value,
                                    })
                                }
                            />

                            <FormSelect
                                label="Does the client speak and understand English?"
                                value={
                                    formState.clientInfoAndNewHome.questions
                                        .clientSpeaksEnglish === undefined
                                        ? ""
                                        : formState.clientInfoAndNewHome
                                                .questions.clientSpeaksEnglish
                                          ? "Yes"
                                          : "No"
                                }
                                onChange={(e) =>
                                    updateClientQuestions({
                                        clientSpeaksEnglish:
                                            e.target.value === "Yes"
                                                ? true
                                                : e.target.value === "No"
                                                  ? false
                                                  : undefined,
                                    })
                                }
                                options={["Yes", "No"]}
                            />

                            <FormInput
                                label="How many adults are in the family?"
                                required
                                type="number"
                                min={0}
                                value={
                                    formState.clientInfoAndNewHome.questions
                                        .adultsInFamily ?? ""
                                }
                                onChange={(e) => {
                                    updateClientQuestions({
                                        adultsInFamily:
                                            e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value),
                                    });

                                    clearError("adultsInFamily");
                                }}
                            />
                            {errors.adultsInFamily && (
                                <p className="text-red-500 text-sm">
                                    {errors.adultsInFamily}
                                </p>
                            )}

                            <FormInput
                                label="How many kids (under 18) are in the family?"
                                required
                                type="number"
                                min={0}
                                value={
                                    formState.clientInfoAndNewHome.questions
                                        .childrenInFamily ?? ""
                                }
                                onChange={(e) => {
                                    updateClientQuestions({
                                        childrenInFamily:
                                            e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value),
                                    });
                                    clearError("childrenInFamily");
                                }}
                            />
                            {errors.childrenInFamily && (
                                <p className="text-red-500 text-sm">
                                    {errors.childrenInFamily}
                                </p>
                            )}

                            <FormSelect
                                label="Is the client a veteran?"
                                required
                                value={
                                    formState.clientInfoAndNewHome.questions
                                        .isVeteran === undefined
                                        ? ""
                                        : formState.clientInfoAndNewHome
                                                .questions.isVeteran
                                          ? "Yes"
                                          : "No"
                                }
                                onChange={(e) => {
                                    updateClientQuestions({
                                        isVeteran:
                                            e.target.value === "Yes"
                                                ? true
                                                : e.target.value === "No"
                                                  ? false
                                                  : undefined,
                                    });

                                    clearError("isVeteran");
                                }}
                                options={["Yes", "No"]}
                            />
                            {errors.isVeteran && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.isVeteran}
                                </p>
                            )}

                            <FormSelect
                                label="Can the client pick up items at the warehouse in Hartford?"
                                required
                                value={
                                    formState.clientInfoAndNewHome.questions
                                        .canPickUp === undefined
                                        ? ""
                                        : formState.clientInfoAndNewHome
                                                .questions.canPickUp
                                          ? "Yes"
                                          : "No"
                                }
                                onChange={(e) => {
                                    updateClientQuestions({
                                        canPickUp:
                                            e.target.value === "Yes"
                                                ? true
                                                : e.target.value === "No"
                                                  ? false
                                                  : undefined,
                                    });

                                    clearError("canPickUp");
                                }}
                                options={["Yes", "No"]}
                            />
                            {errors.canPickUp && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.canPickUp}
                                </p>
                            )}

                            <FormSelect
                                label="Was this client chronic before housing?
                            Please do not submit a furniture request until a client has moved in AND the unit has passed inspection."
                                required
                                value={
                                    formState.clientInfoAndNewHome.questions
                                        .wasChronic === undefined
                                        ? ""
                                        : formState.clientInfoAndNewHome
                                                .questions.wasChronic
                                          ? "Yes"
                                          : "No"
                                }
                                onChange={(e) => {
                                    updateClientQuestions({
                                        wasChronic:
                                            e.target.value === "Yes"
                                                ? true
                                                : e.target.value === "No"
                                                  ? false
                                                  : undefined,
                                    });

                                    clearError("wasChronic");
                                }}
                                options={["Yes", "No"]}
                            />
                            {errors.wasChronic && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.wasChronic}
                                </p>
                            )}

                            <FormSelect
                                label="Has the client moved in yet?"
                                required
                                value={
                                    formState.clientInfoAndNewHome.questions
                                        .hasMovedIn === undefined
                                        ? ""
                                        : formState.clientInfoAndNewHome
                                                .questions.hasMovedIn
                                          ? "Yes"
                                          : "No"
                                }
                                onChange={(e) => {
                                    updateClientQuestions({
                                        hasMovedIn:
                                            e.target.value === "Yes"
                                                ? true
                                                : e.target.value === "No"
                                                  ? false
                                                  : undefined,
                                    });

                                    clearError("hasMovedIn");
                                }}
                                options={["Yes", "No"]}
                            />
                            {errors.hasMovedIn && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.hasMovedIn}
                                </p>
                            )}

                            <FormInput
                                label="Move-in Date"
                                required={
                                    formState.clientInfoAndNewHome.questions
                                        .hasMovedIn === true
                                }
                                type="date"
                                value={
                                    formState.clientInfoAndNewHome.questions
                                        .moveInDate
                                        ? new Date(
                                              (
                                                  formState.clientInfoAndNewHome
                                                      .questions
                                                      .moveInDate as Timestamp
                                              ).toMillis(),
                                          )
                                              .toISOString()
                                              .split("T")[0]
                                        : ""
                                }
                                onChange={(e) => {
                                    const parts = e.target.value
                                        .split("-")
                                        .map(Number);
                                    const isValid =
                                        parts.length === 3 &&
                                        parts.every((n) => !isNaN(n));

                                    if (isValid) {
                                        const newDate = new Date(
                                            parts[0],
                                            parts[1] - 1,
                                            parts[2],
                                        );

                                        updateClientQuestions({
                                            moveInDate:
                                                Timestamp.fromDate(newDate),
                                        });
                                    } else {
                                        updateClientQuestions({
                                            moveInDate: undefined,
                                        });
                                    }

                                    clearError("moveInDate");
                                }}
                            />
                            {errors.moveInDate && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.moveInDate}
                                </p>
                            )}

                            <FormInput
                                label="Notes/Comments"
                                value={
                                    formState.clientInfoAndNewHome.questions
                                        .notes ?? ""
                                }
                                onChange={(e) =>
                                    updateClientQuestions({
                                        notes: e.target.value,
                                    })
                                }
                            />

                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Client&apos;s New Home
                            </h2>
                            <FormInput
                                label="Street Address"
                                required
                                value={
                                    formState.clientInfoAndNewHome.address
                                        .streetAddress ?? ""
                                }
                                onChange={(e) => {
                                    updateClientInfo({
                                        address: {
                                            ...formState.clientInfoAndNewHome
                                                .address,
                                            streetAddress: e.target.value,
                                        },
                                    });

                                    clearError("streetAddress");
                                }}
                            />
                            {errors.streetAddress && (
                                <p className="text-red-500 text-sm">
                                    {errors.streetAddress}
                                </p>
                            )}

                            <FormInput
                                label="Apt, unit, etc. (include floor)"
                                value={
                                    formState.clientInfoAndNewHome.address
                                        .apt ?? ""
                                }
                                onChange={(e) =>
                                    updateClientInfo({
                                        address: {
                                            ...formState.clientInfoAndNewHome
                                                .address,
                                            apt: e.target.value,
                                        },
                                    })
                                }
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col">
                                    <FormSelect
                                        label="City"
                                        required
                                        value={
                                            formState.clientInfoAndNewHome
                                                .address.city ?? ""
                                        }
                                        options={cityOptions}
                                        onChange={(e) => {
                                            updateClientInfo({
                                                address: {
                                                    ...formState
                                                        .clientInfoAndNewHome
                                                        .address,
                                                    city: e.target.value,
                                                },
                                            });

                                            clearError("city");
                                        }}
                                    />
                                    {errors.city && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.city}
                                        </p>
                                    )}
                                </div>

                                <FormInput label="State" value="CT" disabled />
                                <div className="flex flex-col">
                                    <FormInput
                                        label="Zip Code"
                                        required
                                        value={
                                            formState.clientInfoAndNewHome
                                                .address.zipCode ?? ""
                                        }
                                        onChange={(e) => {
                                            updateClientInfo({
                                                address: {
                                                    ...formState
                                                        .clientInfoAndNewHome
                                                        .address,
                                                    zipCode: e.target.value,
                                                },
                                            });

                                            clearError("zipCode");
                                        }}
                                    />
                                    {errors.zipCode && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.zipCode}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <FormSelect
                                label="Does the building have a working elevator?"
                                required
                                value={
                                    formState.clientInfoAndNewHome.questions
                                        .hasElevator === undefined
                                        ? ""
                                        : formState.clientInfoAndNewHome
                                                .questions.hasElevator
                                          ? "Yes"
                                          : "No"
                                }
                                onChange={(e) => {
                                    updateClientQuestions({
                                        hasElevator:
                                            e.target.value === "Yes"
                                                ? true
                                                : e.target.value === "No"
                                                  ? false
                                                  : undefined,
                                    });

                                    clearError("hasElevator");
                                }}
                                options={["Yes", "No"]}
                            />
                            {errors.hasElevator && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.hasElevator}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center mt-8">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                        >
                            Next
                        </Button>
                    </div>
                </form>
            </div>
        </ProtectedRoute>
    );
}
