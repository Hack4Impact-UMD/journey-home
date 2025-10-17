// inventory/types.ts
export type Item = {
  id: string;
  name: string;
  category: "Couches" | "Chairs" | "Tables" | string;
  quantity: number;
  addedAt: string;
  photoUrl?: string;
};

export type DonationItem = {
  id: string;
  name: string;
  quantity: number;
  date: string;
  status: "Unfinished" | "Finished" | "Not reviewed" | "Approved";
  responded: boolean;
  category: "Couches" | "Chairs" | "Tables" | string;
};

export type StockItem = {
  label: string;
  value: number;
  max: number;
};