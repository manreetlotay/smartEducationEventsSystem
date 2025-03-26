import React from "react";
import { Event, EVENT_FORMAT } from "../../../lib/types/Events";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(event.startDate);

  const handleClick = () => {
    // Navigate to the detail page with the event ID
    // The actual event data will be fetched or passed through context/state management
    navigate(`/det/${event.id}`, {
      state: { event }, // Pass the event object as state to the router
    });
  };

  // Function to determine location display text
  const getLocationText = () => {
    if (event.format === EVENT_FORMAT.ONLINE) {
      return "Virtual Event";
    } else if (event.format === EVENT_FORMAT.HYBRID) {
      return event.address ? `${event.address}` : "Hybrid Event";
    } else {
      return event.address || "Location TBA";
    }
  };

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      {/* Banner Image */}
      <div className="h-40 overflow-hidden relative">
        <img
          src={event.bannerImage || "/images/default-event-banner.jpg"}
          alt={event.name}
          className="w-full h-full object-cover"
        />

        {/* Event Format Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              event.format === EVENT_FORMAT.ONLINE
                ? "bg-blue-100 text-blue-800"
                : event.format === EVENT_FORMAT.HYBRID
                ? "bg-purple-100 text-purple-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {event.format === EVENT_FORMAT.ONLINE
              ? "Online"
              : event.format === EVENT_FORMAT.HYBRID
              ? "Hybrid"
              : "In-Person"}
          </span>
        </div>
      </div>

      <div className="p-4">
        {/* Event Name and Price/Free Badge */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg truncate">{event.name}</h3>
          {event.isFree ? (
            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
              Free
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded">
              ${event.price}
            </span>
          )}
        </div>

        {/* Date */}
        <p className="text-gray-600 text-sm mb-2">{formattedDate}</p>

        {/* Location */}
        <p className="text-gray-600 text-sm mb-3">{getLocationText()}</p>

        {/* Virtual Link Indicator (if online or hybrid) */}
        {(event.format === EVENT_FORMAT.ONLINE ||
          event.format === EVENT_FORMAT.HYBRID) &&
          event.virtualPlatformLink && (
            <p className="text-blue-600 text-xs mb-3 flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              Virtual access available
            </p>
          )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {event.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              +{event.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
