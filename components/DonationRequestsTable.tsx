import React from "react";

interface DonationItem {
  id: string;
  name: string;
  quantity: number;
  date: string;
  status: string;
  responded: boolean;
  category: string;
}

interface DonationRequestsTableProps {
  items: DonationItem[];
  onViewItem: (item: DonationItem) => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "finished":
      return "bg-green-100 text-green-800";
    case "unfinished":
      return "bg-amber-100 text-amber-800";
    case "not reviewed":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function DonationRequestsTable({ items, onViewItem }: DonationRequestsTableProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full border-collapse">
        <thead className="bg-white">
          <tr className="border-b border-gray-200">
            <th className="px-6 py-3 text-left font-semibold text-sm text-gray-900 border-r border-gray-200">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <th className="px-6 py-3 text-left font-semibold text-sm text-gray-900 border-r border-gray-200">
              Name
            </th>
            <th className="px-6 py-3 text-left font-semibold text-sm text-gray-900 border-r border-gray-200">
              Quantity
            </th>
            <th className="px-6 py-3 text-left font-semibold text-sm text-gray-900 border-r border-gray-200">
              Date
            </th>
            <th className="px-6 py-3 text-left font-semibold text-sm text-gray-900 border-r border-gray-200">
              Status
            </th>
            <th className="px-6 py-3 text-left font-semibold text-sm text-gray-900 border-r border-gray-200">
              Donations
            </th>
            <th className="px-6 py-3 text-left font-semibold text-sm text-gray-900">
              Responded
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-6 text-center text-gray-500 text-sm">
                No donation requests found.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 border-r border-gray-100">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>

                <td className="px-6 py-4 text-gray-900 font-normal text-sm border-r border-gray-100">
                  {item.name}
                </td>

                <td className="px-6 py-4 border-r border-gray-100">
                  <span className="inline-flex items-center justify-center min-w-[32px] px-2.5 py-1 rounded text-xs bg-amber-100 text-amber-800 font-semibold">
                    {item.quantity}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600 text-sm border-r border-gray-100">
                  {item.date}
                </td>

                <td className="px-6 py-4 border-r border-gray-100">
                  <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-4 border-r border-gray-100">
                  <button
                    onClick={() => onViewItem(item)}
                    className="px-4 py-1.5 bg-cyan-500 text-white text-xs font-medium rounded hover:bg-cyan-600 transition-colors"
                  >
                    View
                  </button>
                </td>

                <td className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={item.responded || item.status.toLowerCase() === "finished"}
                    readOnly
                    className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}