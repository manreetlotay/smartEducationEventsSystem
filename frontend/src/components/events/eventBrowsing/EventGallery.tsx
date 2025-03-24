import React from "react";
import { Event } from "../../../lib/types/Events";
import EventCard from "./EventCard";

interface EventsGalleryProps {
  events: Event[];
}

const EventsGallery: React.FC<EventsGalleryProps> = ({ events }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {events.length > 0 ? (
        events.map((event) => <EventCard key={event.id} event={event} />)
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500">No events found.</p>
        </div>
      )}
    </div>
  );
};

export default EventsGallery;
