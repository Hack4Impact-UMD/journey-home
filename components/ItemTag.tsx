"use client";

type TagProps = {
  name: string;
  color: string;
};

export const categoryColors = (category: string) => {
  return "bg-sky-100 text-blue-900";
};

export const sizeColors: Record<string, string> = {
  Small: "bg-yellow-50 text-yellow-800",
  Medium: "bg-violet-100 text-purple-800",
  Large: "bg-pink-100 text-pink-800",
};

export const quantityColors = (quantity: number) => {
   return "bg-amber-200 text-orange-700";
};


export default function ItemTag({ name, color }: TagProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md font-normal ${color}`}>
      {name}
    </span>
  );
}