"use client";

import { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SearchResult {
  title: string;
  slug: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /* Close when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        open &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setResults([]);
        setQuery("");
        setHighlighted(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  /* Search Debounce */
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setHighlighted(-1);
      } catch (err) {
        console.error("Search Error:", err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  /* Keyboard navigation */
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      setHighlighted((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      e.preventDefault();
    }

    if (e.key === "ArrowUp") {
      setHighlighted((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      e.preventDefault();
    }

    if (e.key === "Enter" && highlighted >= 0) {
      handleResultClick(results[highlighted]);
    }

    if (e.key === "Escape") {
      setOpen(false);
      setResults([]);
      setQuery("");
      setHighlighted(-1);
    }
  }

  /* Click result */
  function handleResultClick(result: SearchResult) {
    setOpen(false);
    setResults([]);
    setQuery("");
    router.push(`/blogs/${result.slug}`);
  }

  /* Open */
  function handleOpen() {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 10);
  }

  return (
    <>
      {/* Trigger button */}
      <motion.button
        aria-label="باز کردن جستجو"
        whileTap={{ scale: 0.9 }}
        onClick={handleOpen}
        className="
          flex items-center gap-1
          px-3 py-2 rounded-xl bg-slate-800/90 border border-cyan-400/60 shadow-neon-blue
          text-cyan-200 hover:text-cyan-100 hover:bg-slate-700/95 transition
        "
        style={{ direction: "rtl" }}
      >
        <FiSearch className="text-lg" />
        <span className="font-shabnam text-base hidden sm:inline">جستجو</span>
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={containerRef}
            key="search-overlay"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.23, ease: "easeInOut" }}
            className="
              fixed inset-0 z-50 flex items-start justify-center px-2 pt-24 md:pt-32
              bg-black/35 backdrop-blur-[2px]
            "
            dir="rtl"
          >
            <motion.div
              layout
              className="
                relative flex flex-col items-center w-full max-w-[400px]
                bg-linear-to-l from-slate-800/95 to-slate-900/90
                border border-cyan-400/60 shadow-neon-blue
                rounded-2xl px-5 py-5 transition-all duration-200
              "
              tabIndex={-1}
            >
              {/* Close button */}
              <motion.button
                aria-label="بستن جستجو"
                onClick={() => setOpen(false)}
                className="absolute left-3 top-4 p-2 rounded-full text-cyan-400 hover:bg-cyan-900/60"
              >
                <FaTimes className="text-lg" />
              </motion.button>

              {/* Search Bar */}
              <div className="flex items-center w-full mb-3">
                <motion.div
                  animate={{ x: 2, color: "#10FFD6" }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="mr-2 text-lg"
                >
                  <FiSearch />
                </motion.div>

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="چی دوست داری پیدا کنی؟"
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-cyan-200 font-yekan text-base"
                  dir="rtl"
                  autoComplete="off"
                />

                {/* Clear query */}
                <AnimatePresence>
                  {query && (
                    <motion.button
                      key="clear-btn"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      onClick={() => {
                        setQuery("");
                        setResults([]);
                        setHighlighted(-1);
                        inputRef.current?.focus();
                      }}
                      className="p-1 rounded-full hover:bg-cyan-900/60 transition mr-1"
                      aria-label="پاک کردن"
                    >
                      <FaTimes className="text-cyan-300 text-[15px]" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Results Dropdown */}
              <AnimatePresence>
                {(results.length > 0 || query) && (
                  <motion.div
                    key="dropdown"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="
                      z-40 w-full max-h-64 overflow-y-auto thin-scrollbar
                      bg-linear-to-bl from-cyan-900/80 to-slate-950/95
                      border border-cyan-400/30 rounded-2xl shadow-xl
                    "
                  >
                    {/* No result */}
                    {!loading && results.length === 0 && query.trim() && (
                      <div className="px-5 py-3 text-cyan-300 text-center font-shabnam text-sm opacity-80">
                        نتیجه‌ای پیدا نشد!
                      </div>
                    )}

                    {/* Loading */}
                    {loading && (
                      <div className="px-5 py-3 text-cyan-300 text-center font-shabnam text-sm">
                        در حال جستجو...
                      </div>
                    )}

                    {/* Result items */}
                    {!loading &&
                      results.map((r, idx) => (
                        <motion.button
                          key={r.slug}
                          layout
                          onMouseEnter={() => setHighlighted(idx)}
                          onMouseLeave={() => setHighlighted(-1)}
                          onClick={() => handleResultClick(r)}
                          className={`
                            flex w-full text-right items-center gap-2 px-5 py-[10px]
                            text-cyan-100 hover:bg-cyan-900/40
                            transition-colors duration-150 font-shabnam text-[15px]
                            ${idx === highlighted ? "ring-1 ring-cyan-400/70" : ""}
                          `}
                          style={{
                            background:
                              idx === highlighted
                                ? "linear-gradient(90deg, oklch(77.7% 0.152 181.912), oklch(78.9% 0.154 211.53))"
                                : undefined,
                            color: idx === highlighted ? "#000" : "",
                          }}
                        >
                          <FiSearch className="text-cyan-400 ml-2" />
                          <span>{r.title}</span>
                        </motion.button>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
