import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EVENT_FORMAT, Event } from "../../../lib/types/Events";
import { useEventContext } from "../../../lib/context/EventContext";
import Footer from "../../footer/Footer";

interface CreateEventProps {
  mode?: "create" | "edit";
  event?: Event; // injected by editEventWrapper when editing
}

const CreateEvent: React.FC<CreateEventProps> = ({ mode = "create", event }) => {
  const [searchParams] = useSearchParams();
  // Determine mode from query parameter if available; fallback to prop or "create"
  const modeFromQuery = (searchParams.get("mode") as "create" | "edit") || mode;
  const navigate = useNavigate();
  const { createEvent, updateEvent } = useEventContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize state with the injected event if editing or empty defaults for creation.
  const initialEventState: Partial<Event> =
    modeFromQuery === "edit" && event
      ? { ...event }
      : {
          name: "",
          description: "",
          format: EVENT_FORMAT.PERSON,
          tags: [],
          bannerImage: "",
          startDate: new Date(),
          endDate: new Date(),
          capacity: 0,
          isFree: true,
          price: 0,
          agenda: "",
          organizers: [],
          sponsors: [],
          speakers: [],
          attendees: [],
          stakeholders: [],
        };

  const [eventState, setEventState] = useState<Partial<Event>>(initialEventState);

  // If the injected event changes in edit mode, update the state.
  useEffect(() => {
    if (modeFromQuery === "edit" && event) {
      setEventState({ ...event });
    }
  }, [modeFromQuery, event]);

  const handleEventChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEventState((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value) {
      setEventState((prev) => ({ ...prev, [name]: new Date(value) }));
    }
  };

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!eventState.name?.trim()) throw new Error("Event name is required");
      if (!eventState.description?.trim())
        throw new Error("Event description is required");
      if (!eventState.agenda?.toString().trim())
        throw new Error("Agenda is required");
      if (eventState.capacity && eventState.capacity <= 0)
        throw new Error("Capacity must be greater than 0");

      if (modeFromQuery === "create") {
        await createEvent(eventState);
      } else {
        // Assume updateEvent accepts a complete Event object.
        await updateEvent(eventState as Event);
      }
      navigate("/myevents");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto mt-25 p-4 sm:p-6 lg:p-8">
        <div className="bg-gray-50 shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {modeFromQuery === "create" ? "Create New Event" : "Edit Event"}
          </h1>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="mb-8">
              <h2 className="text-lg font-medium border-b pb-2 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={eventState.name || ""}
                    onChange={handleEventChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Format *
                  </label>
                  <select
                    name="format"
                    value={eventState.format || EVENT_FORMAT.PERSON}
                    onChange={handleEventChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value={EVENT_FORMAT.PERSON}>In-Person</option>
                    <option value={EVENT_FORMAT.ONLINE}>Online</option>
                    <option value={EVENT_FORMAT.HYBRID}>Hybrid</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Description *
                  </label>
                  <textarea
                    name="description"
                    value={eventState.description || ""}
                    onChange={handleEventChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            {/* Date and Time Section */}
            <div className="mb-8">
              <h2 className="text-lg font-medium border-b pb-2 mb-4">
                Date and Time
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date and Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formatDateForInput(eventState.startDate)}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date and Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formatDateForInput(eventState.endDate)}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
            </div>
            {/* (Additional sections such as Location, Pricing, Agenda, etc. would go here) */}
            <div className="flex justify-end space-x-4 border-t pt-6">
              <button
                type="button"
                onClick={() => navigate("/myevents")}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 text-sm font-medium text-white bg-[#655967] border border-transparent rounded-md shadow-sm hover:bg-gray-700 ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting
                  ? "Submitting..."
                  : modeFromQuery === "create"
                  ? "Create Event"
                  : "Update Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateEvent;
