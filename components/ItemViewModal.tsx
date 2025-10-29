import React from "react";

interface ItemViewModalProps {
  item: any;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "finished": return "bg-green-100 text-green-800";
    case "unfinished": return "bg-amber-100 text-amber-800";
    case "not reviewed": return "bg-rose-100 text-rose-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function ItemViewModal({ item, onClose, onApprove, onReject }: ItemViewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Donation Request Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
            <p className="text-gray-900 text-base">{item.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <span className="inline-flex items-center justify-center px-3 py-1.5 rounded text-sm bg-amber-100 text-amber-800 font-medium">{item.quantity}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <span className={`inline-block px-3 py-1.5 rounded text-sm font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Request Date</label>
            <p className="text-gray-900 text-base">{item.date}</p>
          </div>
          {item.category && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <p className="text-gray-900 text-base">{item.category}</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onReject} className="px-5 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">Reject</button>
          <button onClick={onApprove} className="px-5 py-2.5 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors">Approve</button>
        </div>
      </div>
    </div>
  );
}