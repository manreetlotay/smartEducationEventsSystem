import React, { useState, useEffect } from "react";
import { EVENT_FORMAT } from "../../../lib/types/Events";

export interface FilterState {
  searchQuery: string;
  isFree: boolean;
  selectedTags: string[];
  selectedDate: Date | null;
  location: string;
}

interface FilterComponentProps {
  allTags: string[];
  onFilterChange: (filters: FilterState) => void;
}

const FilterEvents: React.FC<FilterComponentProps> = ({
  allTags,
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    isFree: false,
    selectedTags: [],
    selectedDate: null,
    location: "",
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const toggleTag = (tag: string) => {
    const selectedTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag];

    handleFilterChange({ selectedTags });
  };

  // Helper function to format date properly for input
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return "";
    // Format date as YYYY-MM-DD for input field
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg mb-6">
      <div className="space-y-4">
        {/* Search Bar */}
        <div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search events or locations..."
              className="w-full p-2 bg-white border border-gray-600 rounded-lg pl-10 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              value={filters.searchQuery}
              onChange={(e) =>
                handleFilterChange({ searchQuery: e.target.value })
              }
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Free/Paid Filter */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="free-events"
              className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
              checked={filters.isFree}
              onChange={(e) => handleFilterChange({ isFree: e.target.checked })}
            />
            <label
              htmlFor="free-events"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Free Events Only
            </label>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              className="p-2 bg-white border border-gray-600 rounded text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              value={formatDateForInput(filters.selectedDate)}
              onChange={(e) => {
                const dateValue = e.target.value;
                if (dateValue) {
                  // Create date at noon to avoid timezone issues
                  const selectedDate = new Date(dateValue + "T12:00:00");
                  handleFilterChange({ selectedDate });
                } else {
                  handleFilterChange({ selectedDate: null });
                }
              }}
            />
            {filters.selectedDate && (
              <button
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                onClick={() => handleFilterChange({ selectedDate: null })}
                aria-label="Clear date"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <p className="text-sm font-medium mb-2 font-medium text-gray-700">
            Event Types:
          </p>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filters.selectedTags.includes(tag)
                    ? "bg-[#655967] text-white"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterEvents;
