"use client";
import "./index.css";
import React from "react";
// Types
 type Item = {
  id: string;
  name: string;
  category: "Couches" | "Chairs" | "Tables" | string;
  quantity: number;
  addedAt: string; // MM/DD or M/D
  photoUrl?: string;
};

// Mock data (replace w/ API later)
const ITEMS: Item[] = [
  { id: "1", name: "Lorem ipsum dolor sit amet", category: "Couches", quantity: 1, addedAt: "9/22" },
  { id: "2", name: "Lorem ipsum dolor sit amet", category: "Couches", quantity: 1, addedAt: "9/20" },
  { id: "3", name: "Lorem ipsum dolor sit amet", category: "Couches", quantity: 1, addedAt: "9/19" },
  { id: "4", name: "Lorem ipsum dolor sit amet", category: "Couches", quantity: 1, addedAt: "9/16" },
  { id: "5", name: "Lorem ipsum dolor sit amet", category: "Couches", quantity: 1, addedAt: "9/10" },
  { id: "6", name: "Lorem ipsum dolor sit amet", category: "Couches", quantity: 1, addedAt: "9/8" },
];

const STOCK = [
  { label: "Couches", value: 15 },
  { label: "Chairs", value: 6 },
  { label: "Tables", value: 4 },
];

// Components

function Tabs() {
  return (
    <nav className="flex items-center gap-6 border-b border-black/10 pb-3 text-sm font-medium text-muted-foreground">
      <button className="tab-active">Inventory</button>
      <button className="tab">Donation Requests</button>
      <button className="tab">Reviewed Donations</button>
      <button className="tab">Donated</button>
    </nav>
  );
}

function FilterBar() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <Dropdown label="Category: Any" />
      <SearchInput placeholder="Search" />
      <SortButton />
      <PrimaryButton>Add</PrimaryButton>
    </div>
  );
}

function Dropdown({ label }: { label: string }) {
  return (
    <div className="btn-muted flex items-center justify-between min-w-[160px]">
      <span>{label}</span>
      <svg width="12" height="12" viewBox="0 0 20 20" aria-hidden>
        <path d="M5 7l5 6 5-6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}

function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <input
      type="search"
      placeholder={placeholder}
      className="input w-[260px]"
    />
  );
}

function SortButton() {
  return (
    <button className="btn-muted min-w-[150px] justify-between">
      <span>Highest stock</span>
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
        <path d="M3 7h14M3 12h10M3 17h6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="btn-primary">{children}</button>
  );
}

function PhotoPlaceholder() {
  return <div className="h-14 w-14 rounded-md bg-black/10" />;
}

function Divider() {
  return <hr className="my-4 border-black/10" />;
}

function ProgressBar({ value, tone }: { value: number; tone: "green" | "yellow" | "red" }) {
  const toneClass = tone === "green" ? "bg-green-600" : tone === "yellow" ? "bg-yellow-400" : "bg-red-500";
  return (
    <div className="h-1.5 w-full rounded-full bg-black/10">
      <div className={`h-1.5 rounded-full ${toneClass}`} style={{ width: `${Math.min(100, (value / 15) * 100)}%` }} />
    </div>
  );
}
// Inventory Table
function InventoryTable({ items }: { items: Item[] }) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-black/10 bg-white">
      <table className="w-full table-fixed">
        <thead className="bg-black/5 text-left text-sm text-muted-foreground">
          <tr>
            <th className="px-6 py-3 w-[40%]">Name</th>
            <th className="px-6 py-3 w-[120px]">Photo</th>
            <th className="px-6 py-3 w-[160px]">Category</th>
            <th className="px-6 py-3 w-[120px]">Quantity</th>
            <th className="px-6 py-3 w-[120px]">Date added</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <React.Fragment key={it.id}>
              <tr className="align-middle text-sm">
                <td className="px-6 py-4 font-medium">{it.name}</td>
                <td className="px-6 py-4"><PhotoPlaceholder /></td>
                <td className="px-6 py-4">{it.category}</td>
                <td className="px-6 py-4">{it.quantity}</td>
                <td className="px-6 py-4">{it.addedAt}</td>
              </tr>
              {idx < items.length - 1 && (
                <tr>
                  <td colSpan={5} className="px-6"><Divider /></td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StockSidebar() {
  return (
    <aside className="sticky top-4 hidden w-[300px] shrink-0 lg:block">
      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">Stock</h2>
        <div className="mt-6 space-y-5">
          {STOCK.map((s) => (
            <div key={s.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-medium text-foreground">{s.value}</span>
              </div>
              <ProgressBar
                value={s.value}
                tone={s.label === "Couches" ? "green" : s.label === "Chairs" ? "yellow" : "red"}
              />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
export default function InventoryPage() {
  return (
    <main className="font-family-opensans bg-neutral-100/60 min-h-screen p-6">
      <div className="mx-auto max-w-[1200px]">
        <Tabs />

        <section className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr,300px]">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Inventory</h1>
            <FilterBar />
            <InventoryTable items={ITEMS} />
          </div>
          <StockSidebar />
        </section>
      </div>
    </main>
  );
}
