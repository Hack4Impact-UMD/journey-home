"use client";

import { useState } from "react";
import { collection, doc, Timestamp } from "firebase/firestore";
import { setInventoryRecord, WAREHOUSE_COLLECTION } from "@/lib/services/inventory";
import type { InventoryPhoto, InventoryRecord } from "@/types/inventory";
import { db } from "@/lib/firebase";
import { uploadPhotos } from "@/lib/services/donations";

interface AddItemProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (record: InventoryRecord) => void;
}

const AddItem: React.FC<AddItemProps> = ({ isOpen, onClose, onCreated }) => {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("");
  const [size, setSize] = useState<"Small" | "Medium" | "Large" | "">("");
  const [quantity, setQuantity] = useState<number | null>(1);
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = (selectedFiles: File[]) => {
    setFiles(prev => [...prev, ...selectedFiles].slice(0, 5)); // max 5 files
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const recordData: Omit<InventoryRecord, "id"> = {
      name: name.trim(),
      photos: [],
      category,
      size: size as "Small" | "Medium" | "Large",
      quantity: quantity ?? 1,
      notes: notes.trim() || "N/A",
      donorEmail: null,
      dateAdded: Timestamp.now(),
    };

    const docRef = doc(collection(db, WAREHOUSE_COLLECTION));
    let uploadedPhotos: InventoryPhoto[] = [];
    if (files.length > 0) {
      uploadedPhotos = await uploadPhotos(docRef.id, files);
    }

    const record: InventoryRecord = {
      ...recordData,
      id: docRef.id,
      photos: uploadedPhotos,
    };
    await setInventoryRecord(record);

    onCreated?.(record);
    onClose();
  }

  return (
    <div className="fixed inset-0 w-screen z-50 flex items-center justify-center">
      <div className="bg-white w-screen h-screen p-[1.5em] rounded-[.5em] relative shadow-lg pl-[25em] pr-[25em]">
        <button
          onClick={onClose}
          className="absolute top-[1em] right-[1em] text-gray-400 hover:text-gray-600 text-[1.25em] font-bold"
        >
          X
        </button>

        <h2 className="text-[2em] font-bold mt-[1em] mb-[1em]">Add Item</h2>

        {/* IMPORTANT: onSubmit here */}
        <form className="space-y-[1em]" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium">
              Short description (1–3 words)
            </label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded px-[.75em] py-[.5em] focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black-600">
              <span className="text-red-500">*</span> Category
            </label>
            <select
              className="mt-1 w-full border border-gray-300 rounded px-[.75em] py-[.5em] focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="Sofa">Sofa</option>
              <option value="Chair">Chair</option>
              <option value="Table">Table</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-black-600">
                <span className="text-red-500">*</span> Size
              </label>
              <select
                className="mt-1 w-full border border-gray-300 rounded px-[.75em] py-[.5em] focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={size}
                onChange={(e) =>
                  setSize(e.target.value as "Small" | "Medium" | "Large")
                }
              >
                <option value="">Select a size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-black-600">
                <span className="text-red-500">*</span> Quantity
              </label>
              <input
                type="number"
                className="mt-[.25em] w-full border border-gray-300 rounded px-[.75em] py-[.5em] focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => {
                  const val = e.target.value;
                  setQuantity(val === "" ? 1 : Number(val));
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea
              className="mt-[.25em] w-full border border-gray-300 rounded px-[.75em] py-[.5em] focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-[1em]">
            {/*drag and drop feature is also applied to addItem */}
            <div className="w-[8em] h-[8em] bg-gray-100 rounded flex items-center justify-center cursor-pointer"
              onClick={() => document.getElementById("file-input")?.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-blue-500", "bg-blue-50"); }}
              onDragLeave={(e) => { e.currentTarget.classList.remove("border-blue-500", "bg-blue-50"); }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
                const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
                handleFiles(droppedFiles);
              }}
            >
              <input
                type="file"
                id="file-input"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files ?? []);
                  handleFiles(selectedFiles);
                }}
              />
              <span>Add a photo +</span>
            </div>
            <div className=" flex flex-wrap gap-2 justify-center">
              {files.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-[8em] h-[8em] object-cover rounded border"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="mt-[1em] h-[4em] w-full bg-primary text-white px-[1em] py-[.5em] rounded hover:bg-cyan-600"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
