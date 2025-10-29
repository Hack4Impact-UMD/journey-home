import React from "react";

interface ItemDetailModalProps {
  item: any;
  onClose: () => void;
}

export default function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto flex" onClick={(e) => e.stopPropagation()}>
        <div className="w-1/2 bg-gray-100">
          <div className="h-full flex items-center justify-center">
            <div className="w-full h-96 bg-gray-300" />
          </div>
        </div>
        
        <div className="w-1/2 p-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
            </svg>
          </button>

          <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 rounded text-sm bg-blue-100 text-blue-800">{item.category}</span>
            <span className="px-3 py-1 rounded text-sm bg-purple-100 text-purple-800">{item.size}</span>
            <span className="px-3 py-1 rounded text-sm bg-amber-100 text-amber-800 font-semibold">{item.quantity}</span>
          </div>
          <p className="text-gray-600 mb-2">{item.date}</p>

          <h3 className="font-semibold text-lg mt-6 mb-2">Item info</h3>
          <p className="text-gray-700 mb-6">{item.description}</p>

          <h3 className="font-semibold text-lg mb-4">Donor info</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-300" />
            <div>
              <p className="font-semibold">{item.donor}</p>
              <p className="text-sm text-gray-600">{item.email}</p>
              <p className="text-sm text-gray-600">{item.phone}</p>
            </div>
          </div>

          <h3 className="font-semibold text-lg mb-2">Donor address</h3>
          <p className="text-gray-700 mb-4">{item.address}</p>

          <div className="w-full h-48 bg-gray-200 rounded mb-6" />

          <div className="flex gap-4">
            <button className="px-6 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600">Approve</button>
            <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50">Deny</button>
          </div>
        </div>
      </div>
    </div>
  );
}