// src/components/search/global-search.tsx (FIXED - Proper text colors)
"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@/lib/hooks/use-user";
import { useTheme } from "@/lib/context/theme-context";

interface SearchResult {
  messageId: string;
  chatId: string;
  chatName: string;
  content: string;
  role: "USER" | "ASSISTANT";
  createdAt: string;
  highlightedContent: string;
}

interface GlobalSearchProps {
  onSelectResult?: (chatId: string, messageId: string) => void;
  className?: string;
}

export function GlobalSearch({
  onSelectResult,
  className = "",
}: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const { getThemeClasses } = useTheme();

  const themeClasses = getThemeClasses();

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query.trim());
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search/messages?q=${encodeURIComponent(searchQuery)}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setResults(data.data.results);
          setIsOpen(true);
          setSelectedIndex(-1);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelectResult(results[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(-1);
    if (onSelectResult) {
      onSelectResult(result.chatId, result.messageId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength).trim() + "...";
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input - FIXED: Proper text colors */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder="Search across all chats..."
          className={`w-full pl-10 pr-4 py-2 ${themeClasses.border} border rounded-lg transition-colors ${themeClasses.primaryFocus} ${themeClasses.background} ${themeClasses.text} placeholder:${themeClasses.textMuted} ${
            isLoading ? "opacity-75" : ""
          }`}
        />

        {/* Search Icon / Loading */}
        <div className="absolute left-3 top-2.5">
          {isLoading ? (
            <div
              className={`w-5 h-5 border-2 ${themeClasses.border} border-t-blue-600 rounded-full animate-spin`}
            ></div>
          ) : (
            <svg
              className={`w-5 h-5 ${themeClasses.textMuted}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>

        {/* Clear Button */}
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className={`absolute right-3 top-2.5 ${themeClasses.textMuted} ${themeClasses.hover} transition-colors`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div
          className={`absolute top-full left-0 right-0 z-50 mt-1 ${themeClasses.background} ${themeClasses.border} border rounded-lg shadow-lg max-h-96 overflow-y-auto`}
        >
          {results.length === 0 ? (
            <div className="p-4 text-center">
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div
                    className={`w-4 h-4 border-2 ${themeClasses.border} border-t-blue-600 rounded-full animate-spin`}
                  ></div>
                  <span className={themeClasses.textMuted}>Searching...</span>
                </div>
              ) : query.trim().length >= 2 ? (
                <>
                  <svg
                    className={`w-8 h-8 mx-auto mb-2 ${themeClasses.textMuted}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p className={themeClasses.textMuted}>
                    No messages found for "{query}"
                  </p>
                </>
              ) : (
                <p className={themeClasses.textMuted}>
                  Type at least 2 characters to search
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div
                className={`px-4 py-2 ${themeClasses.borderLight} border-b ${themeClasses.backgroundSecondary} text-sm font-medium ${themeClasses.textSecondary}`}
              >
                {results.length} result{results.length !== 1 ? "s" : ""} for "
                {query}"
              </div>

              {/* Results List */}
              <div className="max-h-80 overflow-y-auto">
                {results.map((result, index) => (
                  <button
                    key={`${result.chatId}-${result.messageId}`}
                    onClick={() => handleSelectResult(result)}
                    className={`w-full text-left px-4 py-3 ${themeClasses.borderLight} border-b last:border-b-0 transition-colors ${
                      index === selectedIndex
                        ? `${themeClasses.primaryLight} ${themeClasses.primaryText}`
                        : themeClasses.hover
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Chat Name */}
                        <div className="flex items-center space-x-2 mb-1">
                          <h4
                            className={`text-sm font-medium ${themeClasses.text} truncate`}
                          >
                            {result.chatName}
                          </h4>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              result.role === "USER"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            }`}
                          >
                            {result.role === "USER" ? "You" : "Assistant"}
                          </span>
                        </div>

                        {/* Message Content */}
                        <p
                          className={`text-sm ${themeClasses.textSecondary} leading-relaxed`}
                          dangerouslySetInnerHTML={{
                            __html: truncateContent(result.highlightedContent),
                          }}
                        />
                      </div>

                      {/* Date */}
                      <div
                        className={`ml-2 text-xs ${themeClasses.textMuted} whitespace-nowrap`}
                      >
                        {formatDate(result.createdAt)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div
                className={`px-4 py-2 ${themeClasses.borderLight} border-t ${themeClasses.backgroundSecondary} text-xs ${themeClasses.textMuted}`}
              >
                Use ↑↓ to navigate, Enter to select, Esc to close
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
