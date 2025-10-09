import React from "react";
import { Card, CardContent } from "@/components/card";

export interface InventoryItem {
  name: string;
  category: string;
  size: string;
  quantity: number;
  date: string;
  img: string;
}


const Tag = ({ text, color }: { text: string; color: string }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${color}`}
  >
    {text}
  </span>
);

interface TableProps {
  items: InventoryItem[];
}

export const InventoryTable: React.FC<TableProps> = ({ items }) => {
  return (
    <Card>
      <CardContent>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Name</th>
              <th>Category</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="py-2 flex items-center gap-2">
                  <img src={item.img} alt={item.name} className="w-10 h-10 rounded object-cover" />
                  {item.name}
                </td>
                <td><Tag text={item.category} color="bg-blue-100 text-blue-700" /></td>
                <td><Tag text={item.size} color="bg-pink-100 text-pink-700" /></td>
                <td><Tag text={item.quantity} color="bg-green-100 text-green-700" /></td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
