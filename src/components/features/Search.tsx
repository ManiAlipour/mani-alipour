"use client";
import { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Search() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlighted, setHighlighted] = useState<number>(-1);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        open &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setHighlighted(-1);
        setResults([]);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Dynamic filter (simulate debounce)
  useEffect(() => {
    // TODO: API REQUEST HERE
    setResults([]);
    setHighlighted(-1);
  }, [query]);

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
      setResults([]);
      setOpen(false);
      setHighlighted(-1);
    }
  }

  function handleResultClick(result: string) {
    setQuery(result);
    setResults([]);
    setOpen(false);
    setHighlighted(-1);
    // Optionally: navigate or trigger an action here
  }

  function handleOpen() {
    setOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  return (
    <>
      <motion.button
        aria-label="باز کردن جستجو"
        onClick={handleOpen}
        whileTap={{ scale: 0.9 }}
        className={`
          flex items-center gap-1
          px-3 py-2 rounded-xl bg-slate-800/90 border border-cyan-400/60 shadow-neon-blue
          text-cyan-200 hover:text-cyan-100 hover:bg-slate-700/95 transition
          focus:ring-2 focus:ring-neon-blue cursor-pointer
        `}
        style={{ direction: "rtl" }}
        tabIndex={0}
      >
        <FiSearch className="text-lg" />
        <span className="font-shabnam text-base hidden sm:inline">جستجو</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={containerRef}
            key="search-overlay"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.23, ease: "easeInOut" }}
            className={`
              fixed inset-0 z-50 flex items-start justify-center px-2 pt-24 md:pt-32 bg-black/35 backdrop-blur-[2px]
            `}
            dir="rtl"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.div
              layout
              className={`
                relative flex flex-col items-center w-full max-w-[400px]
                bg-linear-to-l from-slate-800/95 to-slate-900/90
                border border-cyan-400/60 shadow-neon-blue
                rounded-2xl px-5 py-5 transition-all duration-200
                focus-within:ring-2 focus-within:ring-neon-green
              `}
              tabIndex={-1}
            >
              {/* Close Button */}
              <motion.button
                aria-label="بستن جستجو"
                onClick={() => setOpen(false)}
                className="absolute left-3 top-4 p-2 rounded-full text-cyan-400 hover:bg-cyan-900/60 focus:ring-2 focus:ring-cyan-400"
                tabIndex={0}
              >
                <FaTimes className="text-lg" />
              </motion.button>

              {/* Search Bar */}
              <div className="flex items-center w-full mb-3">
                {/* Search Icon */}
                <motion.div
                  initial={false}
                  animate={{ x: 2, color: "#10FFD6" }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="mr-2 text-lg"
                  aria-hidden
                >
                  <FiSearch />
                </motion.div>
                {/* Input */}
                <input
                  ref={inputRef}
                  type="text"
                  className={`
                    flex-1 bg-transparent outline-none text-white placeholder:text-cyan-200
                    transition-all text-base font-yekan pr-1
                  `}
                  placeholder="چی دوست داری پیدا کنی؟"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  dir="rtl"
                  aria-label="جستجو"
                  autoComplete="off"
                  tabIndex={0}
                />
                {/* Clear Button */}
                <AnimatePresence>
                  {query && (
                    <motion.button
                      key="clear-btn"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 21,
                      }}
                      onClick={() => {
                        setQuery("");
                        setResults([]);
                        setHighlighted(-1);
                        inputRef.current?.focus();
                      }}
                      aria-label="پاک کردن"
                      tabIndex={0}
                      className="p-1 rounded-full hover:bg-cyan-900/60 transition mr-1 focus:ring-2 focus:ring-cyan-400"
                    >
                      <FaTimes className="text-cyan-300 text-[15px]" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Dropdown Overlay */}
              <AnimatePresence>
                {(results.length > 0 || query) && (
                  <motion.div
                    key="dropdown"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.17, ease: "easeOut" }}
                    className={`
                      z-40 w-full max-h-64
                      overflow-y-auto thin-scrollbar
                      bg-linear-to-bl from-cyan-900/80 to-slate-950/95
                      border border-cyan-400/30 rounded-2xl shadow-xl
                      animate-fade-in
                      backdrop-blur-md
                      flex flex-col
                    `}
                    tabIndex={-1}
                  >
                    {results.length === 0 && query.trim() ? (
                      <div className="px-5 py-3 text-cyan-300 text-center font-shabnam text-sm opacity-80">
                        نتیجه‌ای پیدا نشد!
                      </div>
                    ) : (
                      results.map((r, idx) => (
                        <motion.button
                          layout
                          key={r}
                          className={`
                            flex w-full text-right items-center gap-2 px-5 py-[10px]
                            text-cyan-100 hover:bg-cyan-900/40
                            transition-colors duration-150 font-shabnam text-[15px]
                            rounded-${idx === 0 ? "t" : idx === results.length - 1 ? "b" : ""}2xl
                            ${idx === highlighted ? "bg-cyan-600/20 ring-1 ring-cyan-400/70" : ""}
                          `}
                          style={{
                            background:
                              idx === highlighted
                                ? "linear-gradient(90deg, oklch(77.7% 0.152 181.912) 0%, oklch(78.9% 0.154 211.53) 100%)"
                                : undefined,
                            color: idx === highlighted ? "#000" : "",
                          }}
                          onMouseEnter={() => setHighlighted(idx)}
                          onMouseLeave={() => setHighlighted(-1)}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleResultClick(r)}
                          tabIndex={-1}
                          aria-label={`انتخاب "${r}"`}
                        >
                          <FiSearch className="text-cyan-400 ml-2" />
                          <span>{r}</span>
                        </motion.button>
                      ))
                    )}
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
