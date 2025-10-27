//combine all parts here
"use client";
import { useState } from "react";
import InputBox from "../../components/inputBox";
import LongButton from "../../components/longButton";
import SelectBox from "../../components/selectBox";
import Checkbox from "../../components/checkBox";
import SectionHeader from "../../components/sectionheader";

export default function DonorIntake() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        town: "",
        zip: "",
        donatedBefore: "",
        hearAbout: "",
        other: "",
        dropOff: "",
        notes: "",
    });

    const [acks, setAcks] = useState({
        pickupDonation: false,
        refuseAnyItem: false,
        refuseDirtyItems: false,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex flex-col items-center py-10 font-sans">
            {/* Logo */}
            <div className="flex justify-center mb-6">
                <img
                    src="/journey-home-logo.png"
                    alt="Journey Home"
                    className="h-[9em] w-[32em]"
                />
            </div>

            {/* Step progress */}
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-8">
                <span className="text-primary font-medium">
                    1 Personal Information
                </span>
                <div className="w-10 h-[2px] bg-gray-300"></div>
                <span>2 Donations</span>
                <div className="w-10 h-[2px] bg-gray-300"></div>
                <span>3 Review</span>
            </div>

            {/* Form */}
            <form className="w-[58rem] space-y-6">
                {/* Contact */}
                <SectionHeader title="Contact" />
                <div className="flex gap-4">
                    {/* First Name */}
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor="firstName"
                            className="text-sm font-medium mb-1"
                        >
                            * First Name
                        </label>
                        <InputBox
                            type="text"
                            value={form.firstName}
                            onChange={handleChange}
                            name="firstName"
                            logo={undefined}
                        />
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor="lastName"
                            className="text-sm font-medium mb-1"
                        >
                            * Last Name
                        </label>
                        <InputBox
                            type="text"
                            value={form.lastName}
                            onChange={handleChange}
                            name="lastName"
                            logo={undefined}
                        />
                    </div>
                </div>
                <div className="flex flex-col w-full mb-4">
                    <label htmlFor="phone" className="text-sm font-medium mb-1">
                        Phone
                    </label>
                    <InputBox
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        name="phone"
                        logo={undefined} // no logo
                    />
                </div>
                <InputBox
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    name="email"
                />

                {/* Address */}
                <SectionHeader title="Address" />
                <InputBox
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    name="address"
                />
                <div className="flex gap-4">
                    <SelectBox
                        options={["Hartford", "West Hartford", "New Britain"]}
                        value={form.town}
                        onChange={handleChange}
                        name="town"
                    />
                    <InputBox
                        type="text"
                        value="CT"
                        onChange={() => {}}
                        disabled={true}
                        name="state"
                    />
                    <InputBox
                        type="text"
                        value={form.zip}
                        onChange={handleChange}
                        name="zip"
                    />
                </div>
                <p className="text-[14px] text-gray-500">
                    We have listed only the towns we pick up from. If your town
                    is not listed, please contact{" "}
                    <span className="text-blue-600">
                        volunteer@journeyhomect.org
                    </span>{" "}
                    to see if a pick-up is possible.
                </p>

                {/* Additional Questions */}
                <SectionHeader title="Additional Questions" />
                <SelectBox
                    options={["Yes", "No"]}
                    value={form.donatedBefore}
                    onChange={handleChange}
                    name="donatedBefore"
                />
                <SelectBox
                    options={["Friend", "Social Media", "Event", "Other"]}
                    value={form.hearAbout}
                    onChange={handleChange}
                    name="hearAbout"
                />
                <InputBox
                    type="text"
                    value={form.other}
                    onChange={handleChange}
                    name="other"
                />
                <SelectBox
                    options={["Yes", "No"]}
                    value={form.dropOff}
                    onChange={handleChange}
                    name="dropOff"
                />
                <InputBox
                    type="text"
                    value={form.notes}
                    onChange={handleChange}
                    name="notes"
                />

                {/* Acknowledgements */}
                <SectionHeader title="Acknowledgements" />
                <div className="flex flex-col gap-3">
                    <Checkbox
                        label="If you need a pick-up of your items, please acknowledge that there is a suggested donation of $50 requested to help fund this program."
                        checked={acks.pickupDonation}
                        onChange={(e) =>
                            setAcks({
                                ...acks,
                                pickupDonation: e.target.checked,
                            })
                        }
                        required
                    />
                    <Checkbox
                        label="I understand Journey Home has the right to refuse any item."
                        checked={acks.refuseAnyItem}
                        onChange={(e) =>
                            setAcks({
                                ...acks,
                                refuseAnyItem: e.target.checked,
                            })
                        }
                        required
                    />
                    <Checkbox
                        label="I understand that Journey Home WILL refuse items that are dirty, moldy, need to be disassembled, broken, or torn, or items that are missing parts."
                        checked={acks.refuseDirtyItems}
                        onChange={(e) =>
                            setAcks({
                                ...acks,
                                refuseDirtyItems: e.target.checked,
                            })
                        }
                        required
                    />
                </div>
                <LongButton name="Next" type="submit" />
            </form>
        </div>
    );
}
