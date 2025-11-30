"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CaseManagerRequestInput,
  RequestedItem,
  createCaseManagerRequest,
} from "@/lib/services/caseManagerRequests";

const emptyItem: RequestedItem = { name: "", quantity: 1, notes: "" };

type Step = 1 | 2 | 3 | 4; // 4 = Submitted page

export default function CaseManagerFormPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CaseManagerRequestInput>({
    caseManagerName: "",
    caseManagerEmail: "",
    caseManagerPhone: "",
    programName: "",
    clientFirstName: "",
    clientLastName: "",
    clientPhone: "",
    clientEmail: "",
    householdSize: "",
    referralReason: "",
    items: [emptyItem],
    additionalNotes: "",
  });

  const updateField = <K extends keyof CaseManagerRequestInput>(
    key: K,
    value: CaseManagerRequestInput[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateItem = (index: number, update: Partial<RequestedItem>) => {
    setForm((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], ...update };
      return { ...prev, items: newItems };
    });
  };

  const addItemRow = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...emptyItem }] }));
  };

  const removeItemRow = (index: number) => {
    setForm((prev) => {
      const newItems = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: newItems.length ? newItems : [emptyItem] };
    });
  };

  const validateStep1 = () => {
    if (
      !form.caseManagerName.trim() ||
      !form.caseManagerEmail.trim() ||
      !form.programName.trim() ||
      !form.clientFirstName.trim() ||
      !form.clientLastName.trim()
    ) {
      setError("Please complete all required fields.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const cleaned = {
        ...form,
        items: form.items
          .filter((i) => i.name.trim())
          .map((i) => ({
            ...i,
            quantity: Number(i.quantity) || 1,
          })),
      };

      if (cleaned.items.length === 0) {
        setError("Please add at least one requested item.");
        setSubmitting(false);
        return;
      }

      await createCaseManagerRequest(cleaned);
      setStep(4);
    } catch (err) {
      console.error(err);
      setError("Something went wrong when submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="mb-8 flex justify-center gap-12 text-sm">
      {[
        { id: 1, label: "Client Info" },
        { id: 2, label: "Requests" },
        { id: 3, label: "Review" },
      ].map((s) => {
        const active = s.id === step;
        return (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                active
                  ? "border-[#0F97C7] bg-[#0F97C7] text-white"
                  : "border-gray-300 bg-white text-gray-500"
              }`}
            >
              {s.id}
            </div>
            <span className={active ? "text-[#0F97C7]" : "text-gray-500"}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E5EDF3] py-10">
      <div className="mx-auto w-full max-w-4xl rounded-xl bg-white px-12 py-10 shadow-md">

        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img src="/journey-home-logo.png" alt="Journey Home" className="h-14" />
        </div>

        {/* Step indicator */}
        {step !== 4 && <StepIndicator />}

        {/* ERROR BANNER */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* STEP 4 — SUBMITTED */}
        {step === 4 && (
          <div className="flex flex-col items-center py-20 text-center">
            <img src="/journey-home-logo.png" className="h-16 mb-6" />
            <p className="text-lg font-semibold text-gray-800">
              We have received your request!
            </p>
            <p className="mt-2 text-gray-600">
              You can expect to hear back from us within 2 business days.
            </p>
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className={`${step === 4 ? "hidden" : "block"} space-y-8`}
        >
          {/* STEP 1 */}
          {step === 1 && (
            <>
              {/* Case Manager Info */}
              <section>
                <h2 className="mb-3 text-xl font-semibold">Case Manager Info</h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Case manager name*"
                    value={form.caseManagerName}
                    onChange={(e) => updateField("caseManagerName", e.target.value)}
                  />

                  <Input
                    label="Case manager email*"
                    type="email"
                    value={form.caseManagerEmail}
                    onChange={(e) => updateField("caseManagerEmail", e.target.value)}
                  />

                  <Input
                    label="Case manager phone"
                    value={form.caseManagerPhone}
                    onChange={(e) => updateField("caseManagerPhone", e.target.value)}
                  />

                  <Input
                    label="Program name*"
                    value={form.programName}
                    onChange={(e) => updateField("programName", e.target.value)}
                  />
                </div>
              </section>

              {/* Client Info */}
              <section>
                <h2 className="mb-3 text-xl font-semibold">Client Info</h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Client first name*"
                    value={form.clientFirstName}
                    onChange={(e) =>
                      updateField("clientFirstName", e.target.value)
                    }
                  />

                  <Input
                    label="Client last name*"
                    value={form.clientLastName}
                    onChange={(e) => updateField("clientLastName", e.target.value)}
                  />

                  <Input
                    label="Client phone"
                    value={form.clientPhone}
                    onChange={(e) => updateField("clientPhone", e.target.value)}
                  />

                  <Input
                    label="Client email"
                    type="email"
                    value={form.clientEmail}
                    onChange={(e) => updateField("clientEmail", e.target.value)}
                  />

                  <Input
                    label="Household size"
                    value={form.householdSize}
                    onChange={(e) => updateField("householdSize", e.target.value)}
                  />
                </div>

                <label className="mt-4 block text-sm font-medium">
                  Referral reason / notes
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  value={form.referralReason}
                  onChange={(e) => updateField("referralReason", e.target.value)}
                />
              </section>
            </>
          )}

          {/* STEP 2 — Requested Items */}
          {step === 2 && (
            <>
              <section>
                <h2 className="mb-3 text-xl font-semibold">Requested Items</h2>

                {form.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="mb-4 rounded-md border border-gray-200 bg-gray-50 p-4"
                  >
                    <Input
                      label="Item name"
                      value={item.name}
                      onChange={(e) => updateItem(idx, { name: e.target.value })}
                    />

                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <Input
                        label="Quantity"
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(idx, {
                            quantity: Number(e.target.value) || 1,
                          })
                        }
                      />

                      <Input
                        label="Notes"
                        value={item.notes}
                        onChange={(e) => updateItem(idx, { notes: e.target.value })}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItemRow(idx)}
                      className="mt-3 text-sm text-red-600 hover:underline"
                    >
                      Remove item
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addItemRow}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  + Add another item
                </button>
              </section>

              <section>
                <label className="block text-sm font-medium">Additional notes</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  value={form.additionalNotes}
                  onChange={(e) => updateField("additionalNotes", e.target.value)}
                />
              </section>
            </>
          )}

          {/* STEP 3 — Review */}
          {step === 3 && (
            <section>
              <h2 className="mb-6 text-xl font-semibold">Review</h2>

              <ReviewBlock title="Client">
                <ReviewField label="Name" value={`${form.clientFirstName} ${form.clientLastName}`} />
                <ReviewField label="Phone" value={form.clientPhone} />
                <ReviewField label="Email" value={form.clientEmail} />
                <ReviewField label="Household size" value={form.householdSize} />
              </ReviewBlock>

              <ReviewBlock title="Case Manager">
                <ReviewField label="Name" value={form.caseManagerName} />
                <ReviewField label="Email" value={form.caseManagerEmail} />
                <ReviewField label="Phone" value={form.caseManagerPhone} />
                <ReviewField label="Program" value={form.programName} />
              </ReviewBlock>

              <ReviewBlock title="Requests">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-2 py-1 text-left">Item</th>
                      <th className="border border-gray-300 px-2 py-1 text-left">Quantity</th>
                      <th className="border border-gray-300 px-2 py-1 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.items
                      .filter((i) => i.name.trim())
                      .map((item, i) => (
                        <tr key={i}>
                          <td className="border border-gray-300 px-2 py-1">{item.name}</td>
                          <td className="border border-gray-300 px-2 py-1">{item.quantity}</td>
                          <td className="border border-gray-300 px-2 py-1">{item.notes || "—"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </ReviewBlock>

              {form.additionalNotes && (
                <ReviewBlock title="Additional Notes">
                  <p className="text-sm">{form.additionalNotes}</p>
                </ReviewBlock>
              )}
            </section>
          )}

          {/* NAVIGATION BUTTONS */}
          {step < 4 && (
            <div className="mt-10 flex justify-between">
              {/* Back */}
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(((step - 1) as Step))}
                  className="rounded-md border border-gray-300 px-6 py-2 text-sm hover:bg-gray-50"
                >
                  Back
                </button>
              ) : (
                <span />
              )}

              {/* Next */}
              {step < 3 && (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1 && !validateStep1()) return;
                    setStep(((step + 1) as Step));
                  }}
                  className="rounded-md bg-[#0F97C7] px-6 py-2 text-sm font-medium text-white hover:bg-[#0D85AC]"
                >
                  Next
                </button>
              )}

              {/* Submit */}
              {step === 3 && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-[#0F97C7] px-6 py-2 text-sm font-medium text-white hover:bg-[#0D85AC] disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

/* ------------- SMALL COMPONENTS ------------- */

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: any;
  onChange: any;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-gray-300 p-2 text-sm"
      />
    </div>
  );
}

function ReviewBlock({
  title,
  children,
}: {
  title: string;
  children: any;
}) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ReviewField({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <p className="text-sm">
      <span className="font-medium">{label}: </span>
      {value || "—"}
    </p>
  );
}
