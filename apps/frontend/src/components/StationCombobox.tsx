import type { Station } from "@/types";

import { cn } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";

type Props = {
  stations: Station[];
  pageSize: number;
  selectedItem?: Station;
  setSelectedItem: (item: Station | undefined) => void;
};

export function StationCombobox({
  stations,
  pageSize,
  selectedItem,
  setSelectedItem,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredStations = useMemo(() => {
    const q = query.trim().toLowerCase();

    return q
      ? stations.filter((station) => station.name.toLowerCase().includes(q))
      : stations;
  }, [stations, query]);

  const displayedStations = useMemo(() => {
    return filteredStations.slice(0, page * pageSize);
  }, [filteredStations, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    const list = listRef.current;

    if (!list || !isOpen) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = list;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      const isNearBottom = scrollPercentage > 0.8;

      if (isNearBottom && displayedStations.length < filteredStations.length) {
        setPage((prev) => prev + 1);
      }
    };

    list.addEventListener("scroll", handleScroll);

    return () => list.removeEventListener("scroll", handleScroll);
  }, [isOpen, displayedStations.length, filteredStations.length]);

  const handleSelect = (station: Station) => {
    setSelectedItem(station);
    setQuery("");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      if (isOpen && !event.target.closest("[data-select]")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div data-select className="relative w-full ">
      <div className="group relative">
        <input
          ref={inputRef}
          className={cn(
            "w-full rounded-md border px-2 pr-10 py-2.5 text-sm",
            "hover:border-gray-400 focus:border-black focus:outline-none",
          )}
          placeholder="駅を入力"
          value={selectedItem ? selectedItem.name : query}
          onChange={(e) => {
            const val = e.target.value;

            setQuery(val);
            setSelectedItem(undefined);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <ChevronDown
            className={cn(
              "size-4 text-gray-600 transition-transform duration-300",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="absolute z-30 mt-1 w-full max-h-60 overflow-hidden rounded-md border bg-white shadow-lg"
            exit={{ opacity: 0, scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div ref={listRef} className="max-h-60 overflow-y-auto p-2">
              {displayedStations.length > 0 ? (
                displayedStations.map((station) => (
                  <button
                    key={station.code}
                    className="w-full px-3 py-2 text-left rounded hover:bg-gray-100 flex justify-between"
                    type="button"
                    onClick={() => handleSelect(station)}
                  >
                    <div>
                      <p className="text-sm">{station.name}</p>
                      {/* <p className="text-xs text-gray-500"> hoge</p> */}
                    </div>
                    {selectedItem?.code === station.code && (
                      <Check className="size-4 text-primary-600" />
                    )}
                  </button>
                ))
              ) : (
                <div className="flex justify-center items-center h-10 text-sm text-gray-500">
                  該当する駅は見つかりません
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
