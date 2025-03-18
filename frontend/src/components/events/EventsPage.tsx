import React, { useState } from "react";
import FilterEvents, { FilterState } from "./eventDashboard/FilterEvents";
import EventsGallery from "./eventDashboard/EventGallery";
import { Event } from "../../lib/types/Events";

// Mock data - replace with your actual data source
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Conference 2025",
    description: "Annual tech conference featuring the latest innovations",
    date: new Date("2025-04-15"),
    isFree: false,
    tags: ["Technology", "Conference", "Networking"],
    location: "San Francisco, CA",
    imageUrl:
      "https://tailwindui.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
  },
  {
    id: "2",
    title: "Community Cleanup",
    description: "Join us for a day of cleaning up our local park",
    date: new Date("2025-03-22"),
    isFree: true,
    tags: ["Community", "Environment", "Volunteer"],
    location: "Chicago, IL",
    imageUrl:
      "https://tailwindui.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
  },
  {
    id: "3",
    title: "Tech Conference 2025",
    description: "Annual tech conference featuring the latest innovations",
    date: new Date("2025-04-15"),
    isFree: false,
    tags: ["Technology", "Conference", "Networking"],
    location: "San Francisco, CA",
    imageUrl:
      "https://tailwindui.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
  },
  {
    id: "4",
    title: "Tech Conference 2025",
    description: "Annual tech conference featuring the latest innovations",
    date: new Date("2025-04-15"),
    isFree: false,
    tags: ["Technology", "Conference", "Networking"],
    location: "San Francisco, CA",
    imageUrl:
      "https://tailwindui.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
  },
];

// Extract all unique tags from the events
const allTags = Array.from(new Set(mockEvents.flatMap((event) => event.tags)));

const EventsPage: React.FC = () => {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);

  const filterEvents = (filters: FilterState) => {
    return mockEvents.filter((event) => {
      // Search query filter (title or location)
      const matchesSearch =
        !filters.searchQuery ||
        event.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        event.location
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase());

      // Free events filter
      const matchesFree = !filters.isFree || event.isFree;

      // Tags filter
      const matchesTags =
        filters.selectedTags.length === 0 ||
        filters.selectedTags.some((tag) => event.tags.includes(tag));

      // Date filter
      const matchesDate =
        !filters.selectedDate ||
        event.date.toDateString() === filters.selectedDate.toDateString();

      return matchesSearch && matchesFree && matchesTags && matchesDate;
    });
  };

  const handleFilterChange = (filters: FilterState) => {
    setFilteredEvents(filterEvents(filters));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
      <FilterEvents allTags={allTags} onFilterChange={handleFilterChange} />
      <h1 className="text-2xl font-bold mb-6 text-black mt-10">
        Discover Events
      </h1>

      <EventsGallery events={filteredEvents} />
    </div>
  );
};

export default EventsPage;
