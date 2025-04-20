import { cn, Spinner } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, PlusIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { SelectItem } from "@/types";
import type { FocusEvent } from "react";
type SelectProps<T extends SelectItem = SelectItem> = {
  items: T[];
  selectedItem: T | undefined;
  setSelectedItem: (item: T | undefined) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  placeholder?: string;
  onSearch?: (query: string) => void;
  onLoadMore: () => void;
  onChange?: (item: T | undefined) => void;
  isDisabled?: boolean;
  errorMessage?: string;
  isInvalid?: boolean;
  noResultsMessage?: string;
  onNewButtonClick?: () => void;
  newButtonLabel?: string;
  widthClassName?: string;
};
export function Combobox<T extends SelectItem = SelectItem>({
  items,
  selectedItem,
  setSelectedItem,
  isLoading,
  hasMore,
  placeholder = "選択してください",
  onSearch,
  onLoadMore,
  onChange,
  isDisabled,
  errorMessage,
  isInvalid,
  noResultsMessage = "該当するアイテムがありません",
  onNewButtonClick,
  newButtonLabel,
  widthClassName = "max-w-fit",
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleScroll = () => {
    const list = listRef.current;
    const hasNextPage = hasMore ?? false;
    const isCurrentlyLoading = isLoading ?? false;
    if (!list || !hasNextPage || isCurrentlyLoading) return;
    const { scrollTop, scrollHeight, clientHeight } = list;
    // スクロールが80%を超えた時点でロード開始
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    if (scrollPercentage > 0.8) {
      onLoadMore();
    }
  };
  const handleBlur = (e: FocusEvent) => {
    const relatedTarget = e.relatedTarget;
    if (!(relatedTarget instanceof HTMLElement)) return;
    const list = listRef.current;
    if (!list) return;
    if (!list.contains(relatedTarget)) {
      setIsOpen(false);
    }
  };
  const handleSelect = (item: T) => {
    setSelectedItem(item);
    setQuery("");
    setIsOpen(false);
    onChange?.(item);
  };
  const handleClear = () => {
    setSelectedItem(undefined);
    setQuery("");
    setIsOpen(true);
    onSearch?.("");
    onChange?.(undefined);
    inputRef.current?.focus();
  };
  const filteredItems = query
    ? items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase()),
    )
    : items;
  const calculateDropdownPosition = () => {
    if (!inputRef.current) return {};
    const inputRect = inputRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;
    const dropdownHeight = 300;
    // 下のスペースが不足していて、上のスペースが十分にある場合は上に表示
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      return {
        bottom: "100%",
        marginBottom: "0.25rem",
        originY: "bottom",
      };
    }
    // デフォルトは下に表示
    return {
      top: "100%",
      marginTop: "0.25rem",
      originY: "top",
    };
  };
  // ドロップダウン外のクリックを検知してドロップダウンを閉じる機能
  // クリーンアップ関数をつけているためパフォーマンスの影響は少ない
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
  // ドロップダウンの最下部でのスクロール時に外部へスクロールが伝播するのを防ぐ機能
  // スクロールイベントのクリーンアップを行うため、パフォーマンスへの影響は最小限
  useEffect(() => {
    const list = listRef.current;
    if (!list || !isOpen) return;
    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = list;
      const isAtBottom = scrollHeight - scrollTop === clientHeight;
      const isAtTop = scrollTop === 0;
      if ((isAtBottom && e.deltaY > 0) || (isAtTop && e.deltaY < 0)) {
        e.preventDefault();
      }
    };
    list.addEventListener("wheel", handleWheel, { passive: false });
    return () => list.removeEventListener("wheel", handleWheel);
  }, [isOpen]);
  const hasError =
    typeof errorMessage === "string" && errorMessage.trim() !== "";
  return (
    <div className={`relative ${widthClassName}`} data-select>
      <div className="group relative">
        <input
          ref={inputRef}
          className={cn(
            "w-full rounded-md border px-2 pr-12 py-2.5 text-sm",
            "hover:border-default-400 focus:border-black focus:outline-none",
            {
              "border-danger hover:border-danger focus:border-danger placeholder-danger":
                hasError,
              "hover:border-default-200 placeholder-default-300":
                isDisabled === true,
              "border-danger": isInvalid === true,
            },
          )}
          disabled={isDisabled}
          placeholder={placeholder}
          type="text"
          value={selectedItem ? selectedItem.label : query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            onSearch?.(value);
            setSelectedItem(undefined);
            if (!isOpen) setIsOpen(true);
          }}
          onBlur={handleBlur}
          onClick={() => !isOpen && setIsOpen(true)}
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {selectedItem || query ? (
            <button
              className={cn(
                "size-2 p-2 rounded-full bg-gray-400/50",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "flex items-center justify-center",
              )}
              type="button"
              onClick={handleClear}
            >
              <span className="text-[8px] font-bold leading-none text-white">
                ✕
              </span>
            </button>
          ) : null}
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-300 text-default-600",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </div>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            style={{
              maxHeight: newButtonLabel !== undefined ? "16rem" : "12rem",
              ...calculateDropdownPosition(),
            }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute z-30 w-full overflow-hidden rounded-md border bg-white shadow-lg"
            exit={{ opacity: 0, scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {newButtonLabel !== undefined ? (
              <div className="sticky top-0 z-10 border-b bg-white p-2">
                <button
                  className="relative w-full rounded-md px-3 py-2 text-left hover:bg-primary-50 focus:bg-primary-50 focus:outline-none"
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onNewButtonClick?.();
                  }}
                >
                  <div className="flex items-center gap-2 text-primary-600">
                    <PlusIcon className="size-4" />
                    <span className="text-sm">{newButtonLabel}</span>
                  </div>
                </button>
              </div>
            ) : null}
            <div
              ref={listRef}
              className="scrollbar max-h-48 overflow-y-auto p-2"
              onScroll={handleScroll}
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    className="relative w-full rounded-md px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    data-id={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <p className="line-clamp-2 break-all text-sm">
                          {item.label}
                        </p>
                        <p className="line-clamp-2 break-all text-xs text-default-500">
                          {item.description}
                        </p>
                      </div>
                      {selectedItem?.id === item.id ? (
                        <Check className="ml-2 size-4 shrink-0" />
                      ) : null}
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex h-10 items-center justify-center px-3 py-2 text-sm text-gray-500">
                  {(isLoading ?? false) ? (
                    <Spinner size="sm" />
                  ) : (
                    noResultsMessage
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {hasError ? (
        <p className="my-1 text-sm text-danger">{errorMessage}</p>
      ) : null}
    </div>
  );
}