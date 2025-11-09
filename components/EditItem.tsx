"use client";

import { InventoryRecord } from "@/types/inventory";

interface EditItemProps {
  item: InventoryRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditItem: React.FC<EditItemProps> = ({ item, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 w-screen z-50 flex items-center justify-center">
          <div className="bg-white w-screen h-screen p-[1.5em] rounded-[.5em] relative shadow-lg pl-[25em] pr-[25em]">
            <button
              onClick={onClose}
              className="absolute top-[1em] right-[1em] text-gray-400 hover:text-gray-600 text-[1.25em] font-bold"
            >
              X
            </button>
           
            <h2 className="text-[2em] font-bold mt-[1em] mb-[1em]">Edit Item</h2>
            
            <form className="space-y-[1em]">
            
              <div>
                <label className="block text-sm font-medium">Short description (1-3 words)</label>
                <input
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded px-[.75em] py-[.5em] focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
             
              <div>
                <label className="block text-sm font-medium text-black-600">* Category</label>
                <select className="mt-1 w-full border border-gray-300 rounded px-[.75em] py-[.5em] focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option>Sofa</option>
                  <option>Chair</option>
                  <option>Table</option>s
                </select>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-black-600">* Size</label>
                  <select className="mt-1 w-full border border-gray-300 rounded px-[.75em] py-[.5em] focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-black-600">* Quantity</label>
                  <input
                    type="number"
                    className="mt-[.25em] w-full border border-gray-300 rounded px-[.75em] py-[.5em] focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Notes</label>
                <textarea
                  className="mt-[.25em] w-full border border-gray-300 rounded px-[.75em] py-[.5em] focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={4}
                ></textarea>
              </div>
   
              <div className="flex gap-[1em]">
                <div className="w-[8em] h-[8em] bg-gray-100 rounded flex items-center justify-center cursor-pointer">
                  <span>Add a photo +</span>
                </div>
              </div>

              <button
                type="submit"
                className="mt-[1em] h-[4em] w-full bg-primary text-white px-[1em] py-[.5em] rounded hover:bg-cyan-600">
                Edit Item
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export default EditItem;
