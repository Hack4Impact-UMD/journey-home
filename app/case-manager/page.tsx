"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CaseManagerRequestInput,
  RequestedItem,
  createCaseManagerRequest,
} from "@/lib/services/caseManagerRequests";

const emptyItem: RequestedItem = { name: "", quantity: 1, notes: "" };

type Step = 1 | 2 | 3;

export default function CaseManagerFormPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [step, setStep] = useState<Step>(1);

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

  const updateItem = (index: number, value: Partial<RequestedItem>) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], ...value };
      return { ...prev, items };
    });
  };

  const addItemRow = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...emptyItem }] }));
  };

  const removeItemRow = (index: number) => {
    setForm((prev) => {
      const items = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: items.length ? items : [emptyItem] };
    });
  };

  const validateRequiredFields = () => {
    if (
      !form.caseManagerName.trim() ||
      !form.caseManagerEmail.trim() ||
      !form.programName.trim() ||
      !form.clientFirstName.trim() ||
      !form.clientLastName.trim()
    ) {
      setError("Please fill in all required fields (marked with *).");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateRequiredFields()) return;

    const cleanedItems = form.items
      .filter((i) => i.name.trim())
      .map((i) => ({
        ...i,
        quantity: Number(i.quantity) || 1,
      }));

    if (!cleanedItems.length) {
      setError("Please add at least one requested item.");
      return;
    }

    setSubmitting(true);
    try {
      await createCaseManagerRequest({ ...form, items: cleanedItems });
      setSuccessMessage("Request submitted successfully!");
      // you can still refresh or navigate if you want, e.g.:
      // router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting the request.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayItems = form.items.filter((i) => i.name.trim());

  return (
    <div className="min-h-screen bg-[#E5EDF3] py-10">
      <div className="mx-auto w-full max-w-4xl rounded-xl bg-white px-10 py-8 shadow-md">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img
            src="/journey-home-logo.png"
            alt="Journey Home"
            className="h-14"
          />
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex justify-center gap-12 text-sm">
          {[
            { id: 1 as Step, label: "Client Info" },
            { id: 2 as Step, label: "Requests" },
            { id: 3 as Step, label: "Review" },
          ].map(({ id, label }) => {
            const isActive = id === step;
            return (
              <div
                key={id}
                className="flex items-center gap-2"
              >
                <div
                  className={[
                    "flex h-5 w-5 items-center justify-center rounded-full border text-xs",
                    isActive
                      ? "border-[#0F97C7] bg-[#0F97C7] text-white"
                      : "border-gray-300 bg-white text-gray-500",
                  ].join(" ")}
                >
                  {id}
                </div>
                <span
                  className={
                    isActive ? "font-medium text-[#0F97C7]" : "text-gray-500"
                  }
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* STEP 1: Case Manager + Client Info */}
          {step === 1 && (
            <>
              <section>
                <h2 className="mb-3 text-lg font-semibold">Case Manager Info</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Case manager name*
                    </label>
                    <input
                      type="text"
                      value={form.caseManagerName}
                      onChange={(e) =>
                        updateField("caseManagerName", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Case manager email*
                    </label>
                    <input
                      type="email"
                      value={form.caseManagerEmail}
                      onChange={(e) =>
                        updateField("caseManagerEmail", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Case manager phone
                    </label>
                    <input
                      type="tel"
                      value={form.caseManagerPhone}
                      onChange={(e) =>
                        updateField("caseManagerPhone", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Program name*
                    </label>
                    <input
                      type="text"
                      value={form.programName}
                      onChange={(e) =>
                        updateField("programName", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold">Client Info</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      First name*
                    </label>
                    <input
                      type="text"
                      value={form.clientFirstName}
                      onChange={(e) =>
                        updateField("clientFirstName", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Last name*
                    </label>
                    <input
                      type="text"
                      value={form.clientLastName}
                      onChange={(e) =>
                        updateField("clientLastName", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Client phone
                    </label>
                    <input
                      type="tel"
                      value={form.clientPhone}
                      onChange={(e) =>
                        updateField("clientPhone", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Client email
                    </label>
                    <input
                      type="email"
                      value={form.clientEmail}
                      onChange={(e) =>
                        updateField("clientEmail", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Household size
                    </label>
                    <input
                      type="text"
                      value={form.householdSize}
                      onChange={(e) =>
                        updateField("householdSize", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium">
                    Referral reason / notes
                  </label>
                  <textarea
                    rows={3}
                    value={form.referralReason}
                    onChange={(e) =>
                      updateField("referralReason", e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  />
                </div>
              </section>
            </>
          )}

          {/* STEP 2: Requested Items */}
          {step === 2 && (
            <>
              <section>
                <h2 className="mb-3 text-lg font-semibold">Requested Items</h2>

                <div className="space-y-3">
                  {form.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 md:flex-row md:items-center"
                    >
                      <div className="flex-1">
                        <label className="mb-1 block text-xs font-medium">
                          Item name
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            updateItem(index, { name: e.target.value })
                          }
                          className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        />
                      </div>

                      <div className="w-24">
                        <label className="mb-1 block text-xs font-medium">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(index, {
                              quantity: Number(e.target.value) || 1,
                            })
                          }
                          className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="mb-1 block text-xs font-medium">
                          Notes
                        </label>
                        <input
                          type="text"
                          value={item.notes ?? ""}
                          onChange={(e) =>
                            updateItem(index, { notes: e.target.value })
                          }
                          className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItemRow(index)}
                        className="self-start rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addItemRow}
                  className="mt-4 rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
                >
                  + Add another item
                </button>
              </section>

              <section>
                <label className="mb-1 block text-sm font-medium">
                  Additional notes
                </label>
                <textarea
                  rows={3}
                  value={form.additionalNotes}
                  onChange={(e) =>
                    updateField("additionalNotes", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                />
              </section>
            </>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Review</h2>

              <div className="space-y-6 text-sm text-gray-800">
                <div>
                  <h3 className="mb-2 font-semibold">Client</h3>
                  <p>
                    <span className="font-medium">Name: </span>
                    {form.clientFirstName} {form.clientLastName}
                  </p>
                  <p>
                    <span className="font-medium">Client phone: </span>
                    {form.clientPhone || "—"}
                  </p>
                  <p>
                    <span className="font-medium">Client email: </span>
                    {form.clientEmail || "—"}
                  </p>
                  <p>
                    <span className="font-medium">Household size: </span>
                    {form.householdSize || "—"}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Case Manager</h3>
                  <p>
                    <span className="font-medium">Name: </span>
                    {form.caseManagerName}
                  </p>
                  <p>
                    <span className="font-medium">Email: </span>
                    {form.caseManagerEmail}
                  </p>
                  <p>
                    <span className="font-medium">Phone: </span>
                    {form.caseManagerPhone || "—"}
                  </p>
                  <p>
                    <span className="font-medium">Program: </span>
                    {form.programName}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Requests</h3>
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-200 px-2 py-1 text-left">
                          Item
                        </th>
                        <th className="border border-gray-200 px-2 py-1 text-left">
                          Quantity
                        </th>
                        <th className="border border-gray-200 px-2 py-1 text-left">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayItems.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="border border-gray-200 px-2 py-2 text-center text-gray-500"
                          >
                            No items added yet.
                          </td>
                        </tr>
                      )}
                      {displayItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="border border-gray-200 px-2 py-1">
                            {item.name}
                          </td>
                          <td className="border border-gray-200 px-2 py-1">
                            {item.quantity}
                          </td>
                          <td className="border border-gray-200 px-2 py-1">
                            {item.notes || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {form.additionalNotes && (
                  <div>
                    <h3 className="mb-2 font-semibold">Additional notes</h3>
                    <p>{form.additionalNotes}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Navigation buttons (bottom) */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as Step)}
                className="rounded-md border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            ) : (
              <span />
            )}

            {step < 3 && (
              <button
                type="button"
                onClick={() => {
                  if (step === 1) {
                    if (!validateRequiredFields()) return;
                  }
                  setError(null);
                  setStep((prev) => (prev + 1) as Step);
                }}
                className="rounded-md bg-[#0F97C7] px-6 py-2 text-sm font-medium text-white hover:bg-[#0d83ac]"
              >
                Next
              </button>
            )}

            {step === 3 && (
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-[#0F97C7] px-6 py-2 text-sm font-medium text-white disabled:opacity-60 hover:bg-[#0d83ac]"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
