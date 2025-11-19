"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CaseManagerRequestInput,
  RequestedItem,
  createCaseManagerRequest,
} from "@/lib/services/caseManagerRequests";

const emptyItem: RequestedItem = { name: "", quantity: 1, notes: "" };

export default function CaseManagerFormPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (
      !form.caseManagerName.trim() ||
      !form.caseManagerEmail.trim() ||
      !form.programName.trim() ||
      !form.clientFirstName.trim() ||
      !form.clientLastName.trim()
    ) {
      setError("Please fill in all required fields (marked with *).");
      return;
    }

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
      setTimeout(() => router.refresh(), 1500);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting the request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-semibold">
          Case Manager Request Form
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          Submit requests for client furniture and household items.
        </p>

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
          {/* Case Manager Info */}
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
                  required
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
                  required
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
                  onChange={(e) => updateField("programName", e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                />
              </div>
            </div>
          </section>

          {/* Client Info */}
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
                  required
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
                  required
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
                  onChange={(e) => updateField("clientPhone", e.target.value)}
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
                  onChange={(e) => updateField("clientEmail", e.target.value)}
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

          {/* Requested Items */}
          <section>
            <h2 className="mb-3 text-lg font-semibold">Requested Items</h2>

            <div className="space-y-3">
              {form.items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 rounded-md border border-gray-200 p-3 md:flex-row md:items-center"
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

          {/* Additional Notes */}
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

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
