// src/components/search/global-search.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@/lib/hooks/use-user";

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

  // Get user's theme
  const userTheme = user?.theme || "blue";

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case "green":
        return {
          primary: "bg-green-600",
          primaryHover: "hover:bg-green-50",
          primaryText: "text-green-600",
          focus: "focus:ring-green-500 focus:border-green-500",
        };
      case "purple":
        return {
          primary: "bg-purple-600",
          primaryHover: "hover:bg-purple-50",
          primaryText: "text-purple-600",
          focus: "focus:ring-purple-500 focus:border-purple-500",
        };
      case "red":
        return {
          primary: "bg-red-600",
          primaryHover: "hover:bg-red-50",
          primaryText: "text-red-600",
          focus: "focus:ring-red-500 focus:border-red-500",
        };
      case "orange":
        return {
          primary: "bg-orange-600",
          primaryHover: "hover:bg-orange-50",
          primaryText: "text-orange-600",
          focus: "focus:ring-orange-500 focus:border-orange-500",
        };
      case "indigo":
        return {
          primary: "bg-indigo-600",
          primaryHover: "hover:bg-indigo-50",
          primaryText: "text-indigo-600",
          focus: "focus:ring-indigo-500 focus:border-indigo-500",
        };
      default: // blue
        return {
          primary: "bg-blue-600",
          primaryHover: "hover:bg-blue-50",
          primaryText: "text-blue-600",
          focus: "focus:ring-blue-500 focus:border-blue-500",
        };
    }
  };

  const themeClasses = getThemeClasses(userTheme);

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
      {/* Search Input */}
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
          className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg transition-colors ${themeClasses.focus} ${
            isLoading ? "bg-gray-50" : "bg-white"
          }`}
        />

        {/* Search Icon / Loading */}
        <div className="absolute left-3 top-2.5">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          ) : (
            <svg
              className="w-5 h-5 text-gray-400"
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
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
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
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </div>
              ) : query.trim().length >= 2 ? (
                <>
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-gray-300"
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
                  <p>No messages found for "{query}"</p>
                </>
              ) : (
                <p>Type at least 2 characters to search</p>
              )}
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 text-sm font-medium text-gray-700">
                {results.length} result{results.length !== 1 ? "s" : ""} for "
                {query}"
              </div>

              {/* Results List */}
              <div className="max-h-80 overflow-y-auto">
                {results.map((result, index) => (
                  <button
                    key={`${result.chatId}-${result.messageId}`}
                    onClick={() => handleSelectResult(result)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors ${
                      index === selectedIndex
                        ? `${themeClasses.primaryHover} ${themeClasses.primaryText}`
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Chat Name */}
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {result.chatName}
                          </h4>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              result.role === "USER"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {result.role === "USER" ? "You" : "Assistant"}
                          </span>
                        </div>

                        {/* Message Content */}
                        <p
                          className="text-sm text-gray-600 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: truncateContent(result.highlightedContent),
                          }}
                        />
                      </div>

                      {/* Date */}
                      <div className="ml-2 text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(result.createdAt)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
                Use ↑↓ to navigate, Enter to select, Esc to close
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
