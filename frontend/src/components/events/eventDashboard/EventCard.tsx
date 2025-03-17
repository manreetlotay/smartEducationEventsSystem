import React from "react";
import { Event } from "../../../lib/types/Events";
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
  }).format(event.date);

  const handleClick = () => {
    navigate(`/det/${event.id}`);
  };

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="h-40 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg truncate">{event.title}</h3>
          {event.isFree && (
            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
              Free
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-2">{formattedDate}</p>
        <p className="text-gray-600 text-sm mb-3">{event.location}</p>
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
