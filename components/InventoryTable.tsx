import React from "react";

interface InventoryTableProps {
  items: any[];
  onViewDonor: (donor: string) => void;
}

export default function InventoryTable({ items, onViewDonor }: InventoryTableProps) {
  const getStatusColor = (status: string) => {
    if (status === "Approved") return "bg-green-100 text-green-800";
    if (status === "Denied") return "bg-rose-100 text-rose-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-white border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-sm border-r border-gray-200"><input type="checkbox" /></th>
            <th className="px-6 py-3 text-left font-semibold text-sm border-r border-gray-200">Name</th>
            <th className="px-6 py-3 text-left font-semibold text-sm border-r border-gray-200">Category</th>
            <th className="px-6 py-3 text-left font-semibold text-sm border-r border-gray-200">Size</th>
            <th className="px-6 py-3 text-left font-semibold text-sm border-r border-gray-200">Quantity</th>
            <th className="px-6 py-3 text-left font-semibold text-sm border-r border-gray-200">Date</th>
            <th className="px-6 py-3 text-left font-semibold text-sm border-r border-gray-200">Size</th>
            <th className="px-6 py-3 text-left font-semibold text-sm">View and Edit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 border-r border-gray-100"><input type="checkbox" /></td>
              <td className="px-6 py-4 border-r border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded" />
                  <span className="font-normal">{item.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 border-r border-gray-100">
                <span className="inline-block px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">{item.category}</span>
              </td>
              <td className="px-6 py-4 border-r border-gray-100">
                <span className="inline-block px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">{item.size}</span>
              </td>
              <td className="px-6 py-4 border-r border-gray-100">
                <span className="inline-block px-2 py-1 rounded text-xs bg-amber-100 text-amber-800 font-semibold">{item.quantity}</span>
              </td>
              <td className="px-6 py-4 border-r border-gray-100 text-sm text-gray-600">{item.date}</td>
              <td className="px-6 py-4 border-r border-gray-100">
                <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
              </td>
              <td className="px-6 py-4">
                <button onClick={() => onViewDonor(item.donor)} className="px-4 py-1.5 bg-cyan-500 text-white text-xs rounded hover:bg-cyan-600 mr-2">View</button>
                <button className="text-gray-600">•••</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}