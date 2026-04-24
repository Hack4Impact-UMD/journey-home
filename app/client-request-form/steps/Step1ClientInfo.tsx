"use client";

import StepIndicator from "../../../components/form/StepIndicator";
import FormInput from "../../../components/form/FormInput";
import FormSelect from "../../../components/form/FormSelect";
import Button from "../../../components/form/Button";
import { useState } from "react";
import { useCaseForm } from "../caseContext";
import Image from "next/image";
import { Timestamp } from "firebase/firestore";
import { YesNoUnsure } from "@/types/client-requests";

export default function Step1ClientInfo() {
    const {
        formState,
        updateClientInfo,
        updateClientQuestions,
        updateSecondaryContact,
        setCurrentStep,
    } = useCaseForm();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): Record<string, string> => {
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
        if (client.questions.clientSpeaksEnglish === undefined)
            newErrors.clientSpeaksEnglish = "Please select English proficiency";
        if (client.questions.isVeteran === undefined)
            newErrors.isVeteran = "Please select if client is a veteran";
        if (client.questions.canPickUp === undefined)
            newErrors.canPickUp = "Please select pickup option";
        if (client.questions.wasChronic === undefined)
            newErrors.wasChronic = "Please select chronic homelessness option";
        if (client.questions.hasMovedIn === undefined)
            newErrors.hasMovedIn = "Please select move-in status";
        if (!client.questions.moveInDate)
            newErrors.moveInDate = "Move-in date is required";
        if (
            client.secondaryContact?.phone &&
            !/^\d{3}-\d{3}-\d{4}$/.test(client.secondaryContact.phone)
        )
            newErrors.secondaryContactPhone =
                "Enter a valid 10-digit phone number (e.g. 555-867-5309)";

        if (!client.address?.streetAddress)
            newErrors.streetAddress = "Street address is required";
        if (!client.address?.city) newErrors.city = "City is required";
        if (!client.address?.zipCode)
            newErrors.zipCode = "Zip code is required";
        else if (!/^\d{5}(-\d{4})?$/.test(client.address.zipCode))
            newErrors.zipCode = "Enter a valid zip code (e.g. 06103 or 06103-1234)";
        if (client.questions.hasElevator === undefined)
            newErrors.hasElevator = "Please select elevator option";

        setErrors(newErrors);
        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            const firstKey = Object.keys(validationErrors)[0];
            document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }
        setCurrentStep(2);
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
                                id="firstName"
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
                                id="lastName"
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
                                id="hmis"
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
                                id="programName"
                                label="Program Name"
                                value={
                                    formState.clientInfoAndNewHome.programName ?? ""
                                }
                                onChange={(e) => {
                                    updateClientInfo({ programName: e.target.value });
                                    clearError("programName");
                                }}
                            />
                            {errors.programName && (
                                <p className="text-red-500 text-sm">
                                    {errors.programName}
                                </p>
                            )}

                            <FormInput
                                id="phoneNumber"
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
                                id="secondaryContactPhone"
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
                                    clearError("secondaryContactPhone");
                                }}
                            />
                            {errors.secondaryContactPhone && (
                                <p className="text-red-500 text-sm">
                                    {errors.secondaryContactPhone}
                                </p>
                            )}

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
                                id="clientSpeaksEnglish"
                                label="Does the client speak and understand English?"
                                required
                                value={
                                    formState.clientInfoAndNewHome.questions
                                        .clientSpeaksEnglish === undefined
                                        ? ""
                                        : formState.clientInfoAndNewHome
                                                .questions.clientSpeaksEnglish
                                          ? "Yes"
                                          : "No"
                                }
                                onChange={(e) => {
                                    updateClientQuestions({
                                        clientSpeaksEnglish:
                                            e.target.value === "Yes"
                                                ? true
                                                : e.target.value === "No"
                                                  ? false
                                                  : undefined,
                                    });
                                    clearError("clientSpeaksEnglish");
                                }}
                                options={["Yes", "No"]}
                            />
                            {errors.clientSpeaksEnglish && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.clientSpeaksEnglish}
                                </p>
                            )}

                            <FormInput
                                id="adultsInFamily"
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
                                id="childrenInFamily"
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
                                id="isVeteran"
                                label="Is the client a veteran?"
                                required
                                value={formState.clientInfoAndNewHome.questions.isVeteran ?? ""}
                                onChange={(e) => {
                                    updateClientQuestions({
                                        isVeteran: e.target.value === "" ? undefined : e.target.value as YesNoUnsure,
                                    });
                                    clearError("isVeteran");
                                }}
                                options={["Yes", "No", "Unsure"]}
                            />
                            {errors.isVeteran && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.isVeteran}
                                </p>
                            )}

                            <FormSelect
                                id="canPickUp"
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
                                id="wasChronic"
                                label="Was this client chronic before housing?"
                                required
                                value={formState.clientInfoAndNewHome.questions.wasChronic ?? ""}
                                onChange={(e) => {
                                    updateClientQuestions({
                                        wasChronic: e.target.value === "" ? undefined : e.target.value as YesNoUnsure,
                                    });
                                    clearError("wasChronic");
                                }}
                                options={["Yes", "No", "Unsure"]}
                            />
                            {errors.wasChronic && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.wasChronic}
                                </p>
                            )}

                            <FormSelect
                                id="hasMovedIn"
                                label="Has the client moved in yet? Please do not submit a furniture request until a client has moved in AND the unit has passed inspection."
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
                                id="moveInDate"
                                label="Move-in Date"
                                required
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
                                            moveInDate: null,
                                        });
                                    }

                                    clearError("moveInDate");
                                }}
                            />
                            {errors.moveInDate && (
                                <p className="text-red-500 text-sm">
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
                                id="streetAddress"
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
                                        id="city"
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
                                        id="zipCode"
                                        label="Zip Code"
                                        required
                                        value={
                                            formState.clientInfoAndNewHome
                                                .address.zipCode ?? ""
                                        }
                                        onChange={(e) => {
                                            const digits = e.target.value.replace(/[^\d-]/g, "");
                                            updateClientInfo({
                                                address: {
                                                    ...formState
                                                        .clientInfoAndNewHome
                                                        .address,
                                                    zipCode: digits,
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
                                id="hasElevator"
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
    );
}
