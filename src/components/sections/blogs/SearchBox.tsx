"use client";
import { FiSearch } from "react-icons/fi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchBox() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const onsearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };
  return (
    <div className="mx-10 relative group">
      <label htmlFor="search-input" className="sr-only">
        جستجوی مقاله
      </label>

      <input
        id="search-input"
        type="search"
        placeholder="جستجوی مقاله..."
        className="
          w-full py-3 pr-12 pl-4 rounded-xl 
          bg-slate-900/60 border border-slate-700 
          text-white placeholder:text-gray-400 
          focus:outline-none focus:border-cyan-500/50 
          focus:ring-2 focus:ring-cyan-500/20
          transition-all duration-300
        "
        onChange={onsearch}
      />

      <FiSearch
        className="
          absolute right-4 top-1/2 -translate-y-1/2 
          text-gray-300 group-focus-within:text-cyan-400 
          transition-colors duration-300
        "
        size={20}
      />
    </div>
  );
}
