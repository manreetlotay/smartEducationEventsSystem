import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Event } from "../../../lib/types/Events";
import EventCard from "../eventBrowsing/EventCard";
import { useEventContext } from "../../../lib/context/EventContext";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
const MyEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const { events, loading: contextLoading } = useEventContext();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // For testing, assume the logged-in user is admin1
  const currentUserId = "admin1";

  // Filter events where the current user is the admin
  useEffect(() => {
    if (events.length > 0) {
      const filteredEvents = events.filter(
        (event) => event.eventAdmin.id === currentUserId
      );
      setMyEvents(filteredEvents);
      setLoading(false);
    } else if (!contextLoading) {
      // If context finished loading but no events found
      setLoading(false);
    }
  }, [events, contextLoading, currentUserId]);

  // Check if the user has any events
  const hasEvents = myEvents.length > 0;

  return (
    <div className="max-w-7xl mx-auto mt-30 px-4 py-8 mt-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
        <button
          onClick={() => navigate("/create-event")}
          className="px-4 py-2 bg-[#655967] text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Create New Event
        </button>
      </div>

      {loading || contextLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : hasEvents ? (
        <div>
          <div className="bg-violet-50 border-l-4 border-gray-500 p-4 mb-6 ">
            <p className="text-gray-700">
              Manage your events here. Click on any event to edit details, view
              attendees, or make updates.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/admin-event/${event.id}`)}
                className="cursor-pointer transform transition-transform hover:scale-[1.02]"
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <PencilSquareIcon className="h-8 w-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            You haven't created any events yet
          </h2>
          <p className="text-gray-600 mb-6">
            Begin now by creating your first event. As an admin, you'll be able
            to manage attendees, edit event details, and get insights after the
            event.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;
