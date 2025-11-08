"use client";
import { useState } from "react";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => Promise<void> | void;
}) {
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(q);
  };

  return (
    <form onSubmit={submit} className="flex">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search"
        className="h-10 w-80 rounded-l-[2px] border border-gray-300 bg-white px-3 text-sm outline-none"
      />
      <button
        type="submit"
        onClick={() => onSearch(q)}
        className="h-10 rounded-r-[2px] border border-l-0 border-gray-300 bg-white px-3 text-sm hover:bg-gray-50"
        aria-label="Search"
      >
        {/*SVG from figma*/}
        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.2164 8.86019C16.6467 8.86023 17.9929 9.41716 19.0035 10.4295C20.0141 11.4419 20.5737 12.7847 20.5739 14.2166C20.5739 15.413 20.1841 16.5509 19.4645 17.4813L24.1022 22.119C24.1157 22.1325 24.1261 22.1491 24.1334 22.1668C24.1407 22.1845 24.1451 22.2033 24.1451 22.2225C24.1451 22.2417 24.1407 22.2605 24.1334 22.2782C24.1261 22.2959 24.1157 22.3124 24.1022 22.326L23.3239 23.1024C23.3103 23.116 23.2937 23.1272 23.276 23.1346C23.2582 23.142 23.2386 23.1453 23.2194 23.1453C23.2003 23.1453 23.1813 23.1419 23.1637 23.1346C23.146 23.1272 23.1294 23.116 23.1158 23.1024L18.4791 18.4666C17.5488 19.1845 16.4128 19.574 15.2164 19.5741C13.7843 19.5741 12.4391 19.0172 11.4283 18.0047C10.4177 16.994 9.85901 15.6469 9.85901 14.2166C9.85913 12.7847 10.4161 11.4401 11.4283 10.4295C12.4391 9.41881 13.7861 8.86019 15.2164 8.86019ZM15.2164 10.2166C14.1486 10.2166 13.1445 10.6332 12.3873 11.3885C11.6322 12.1437 11.2166 13.149 11.2164 14.2166C11.2164 15.2844 11.6321 16.2886 12.3873 17.0457C13.1445 17.8011 14.1486 18.2166 15.2164 18.2166C16.2841 18.2166 17.2875 17.8009 18.0446 17.0457C18.7999 16.2904 19.2164 15.2845 19.2164 14.2166C19.2163 13.149 18.7998 12.1455 18.0446 11.3885C17.2893 10.6315 16.2842 10.2167 15.2164 10.2166Z" fill="#262626"/>
        </svg>

      </button>
    </form>
  );
}
