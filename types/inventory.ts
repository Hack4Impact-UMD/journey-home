export interface InventoryPhoto {
  url: string;
  altText: string;
}

export interface InventoryRecordData {
  name: string;
  thumbnail: InventoryPhoto;
  otherPhotos: InventoryPhoto[];
  category: string;
  notes: string;
  quantity: number;
  dateAdded: Date;
}

export interface InventoryRecord extends InventoryRecordData {
  id: string; // this is the document ID assigned by Firebase
}

export type SearchFilters = {
  categories: string[];
  minStock: number | undefined;
  maxStock: number | undefined;
  beforeDate: Date | undefined;
  afterDate: Date | undefined;
};
