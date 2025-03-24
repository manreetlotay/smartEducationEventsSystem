import React, { useState, useEffect } from "react";
import FilterEvents, { FilterState } from "./FilterEvents";
import EventsGallery from "./EventGallery";
import { Event } from "../../../lib/types/Events";
import { useEventContext } from "../../../lib/context/EventContext";

const EventsPage: React.FC = () => {
  const {
    events,
    allTags,
    loading: contextLoading,
    fetchEvents,
  } = useEventContext();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Initial setup - use events from context
  useEffect(() => {
    if (events.length > 0) {
      setFilteredEvents(events);
      setLoading(false);
    } else if (!contextLoading) {
      // If context finished loading but no events found, stop local loading indicator
      setLoading(false);
    }
  }, [events, contextLoading]);

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Filter function
  const filterEvents = (filters: FilterState) => {
    return events.filter((event) => {
      // Search query filter (name or location)
      const matchesSearch =
        !filters.searchQuery ||
        event.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        (event.address &&
          event.address
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()));

      // Free events filter
      const matchesFree = !filters.isFree || event.isFree;

      // Tags filter
      const matchesTags =
        filters.selectedTags.length === 0 ||
        filters.selectedTags.some((tag) => event.tags.includes(tag));

      // Date filter - check if event is happening on the selected date
      const matchesDate =
        !filters.selectedDate ||
        isSameDay(event.startDate, filters.selectedDate) ||
        (event.endDate &&
          filters.selectedDate &&
          event.startDate <= filters.selectedDate &&
          event.endDate >= filters.selectedDate);

      return matchesSearch && matchesFree && matchesTags && matchesDate;
    });
  };

  const handleFilterChange = (filters: FilterState) => {
    setLoading(true);
    // Small delay to show loading state (for UX purposes)
    setTimeout(() => {
      setFilteredEvents(filterEvents(filters));
      setLoading(false);
    }, 300);
  };

  // Function to handle manual refresh
  const handleRefresh = () => {
    setLoading(true);
    fetchEvents().then(() => {
      setLoading(false);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Discover Events</h1>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-[#49475B] text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Refresh Events
        </button>
      </div>

      <FilterEvents allTags={allTags} onFilterChange={handleFilterChange} />

      <div className="flex justify-between items-center mb-6 mt-10">
        <h2 className="text-xl font-semibold text-gray-800">
          Unlock Knowledge Near You
        </h2>
        <p className="text-gray-600">
          Showing {filteredEvents.length}{" "}
          {filteredEvents.length === 1 ? "event" : "events"}
        </p>
      </div>

      {loading || contextLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#49475B]"></div>
        </div>
      ) : filteredEvents.length > 0 ? (
        <EventsGallery events={filteredEvents} />
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No events found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters to find events
          </p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
