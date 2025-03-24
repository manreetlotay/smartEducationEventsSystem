import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EVENT_FORMAT, Event } from "../../../lib/types/Events";
import { useEventContext } from "../../../lib/context/EventContext";

interface CreateEventProps {
  mode?: "create" | "edit";
}

const CreateEvent: React.FC<CreateEventProps> = ({ mode = "create" }) => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { getEventById } = useEventContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Main event state
  const [event, setEvent] = useState<Partial<Event>>({
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
  });

  // Email list states
  const [organizerEmails, setOrganizerEmails] = useState<string[]>([]);
  const [speakerEmails, setSpeakerEmails] = useState<string[]>([]);
  const [sponsorEmails, setSponsorEmails] = useState<string[]>([]);
  const [stakeholderEmails, setStakeholderEmails] = useState<string[]>([]);

  // Form input states for emails
  const [organizerEmailInput, setOrganizerEmailInput] = useState("");
  const [speakerEmailInput, setSpeakerEmailInput] = useState("");
  const [sponsorEmailInput, setSponsorEmailInput] = useState("");
  const [stakeholderEmailInput, setStakeholderEmailInput] = useState("");

  // Tags input state
  const [newTag, setNewTag] = useState("");

  // Fetch event data if in edit mode
  useEffect(() => {
    if (mode === "edit" && eventId) {
      const existingEvent = getEventById(eventId);
      if (existingEvent) {
        setEvent(existingEvent);

        // Extract emails from the event
        setOrganizerEmails(existingEvent.organizers.map((org) => org.email));
        setSpeakerEmails(
          existingEvent.speakers.map((speaker) => speaker.email)
        );
        setSponsorEmails(
          existingEvent.sponsors.map((sponsor) => sponsor.email)
        );
        setStakeholderEmails(
          existingEvent.stakeholders.map((stake) => stake.email)
        );
      } else {
        setError("Event not found");
      }
    }
  }, [mode, eventId, getEventById]);

  // Basic event info handlers
  const handleEventChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle between free and paid event
  const handleFreeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isFree = e.target.checked;
    setEvent((prev) => ({
      ...prev,
      isFree,
      // If it's a free event, reset price to 0
      ...(isFree ? { price: 0 } : {}),
    }));
  };

  // Format dates for input fields
  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 16);
  };

  // Handle date changes with proper conversion
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value) {
      setEvent((prev) => ({ ...prev, [name]: new Date(value) }));
    }
  };

  // Tags handlers
  const addTag = () => {
    if (newTag.trim() !== "" && !event.tags?.includes(newTag.trim())) {
      setEvent((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEvent((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  // Email handlers - FIXED using the same pattern as tags
  const addEmail = (
    emailInput: string,
    emailList: string[],
    setEmailList: React.Dispatch<React.SetStateAction<string[]>>,
    setEmailInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (emailInput.trim() !== "" && !emailList.includes(emailInput.trim())) {
      setEmailList((prev) => [...prev, emailInput.trim()]);
      setEmailInput("");
    }
  };

  const removeEmail = (
    emailToRemove: string,
    emailList: string[],
    setEmailList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setEmailList((prev) => prev.filter((email) => email !== emailToRemove));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!event.name?.trim()) throw new Error("Event name is required");
      if (!event.description?.trim())
        throw new Error("Event description is required");
      if (!event.bannerImage?.trim())
        throw new Error("Banner image URL is required");
      if (!event.agenda?.toString().trim())
        throw new Error("Agenda is required");
      if (event.capacity && event.capacity <= 0)
        throw new Error("Capacity must be greater than 0");

      // Format validation
      if (event.format === EVENT_FORMAT.PERSON && !event.address) {
        throw new Error("Physical address is required for in-person events");
      }

      if (event.format === EVENT_FORMAT.ONLINE && !event.virtualPlatformLink) {
        throw new Error("Virtual platform link is required for online events");
      }

      if (!event.isFree && (!event.price || event.price <= 0)) {
        throw new Error("Price must be greater than 0 for paid events");
      }

      // In a real application, you would send the event data and the emails to the backend
      console.log("Submitting event:", {
        ...event,
        organizerEmails,
        speakerEmails,
        sponsorEmails,
        stakeholderEmails,
      });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to the my events page after successful submission
      navigate("/myevents");
    } catch (error) {
      console.error("Error creating event:", error);
      setError(
        `${
          error instanceof Error ? error.message : "An unknown error occurred"
        }`
      );
      setIsSubmitting(false);
    }
  };

  // Component for email lists - FIXED with tags input pattern
  const EmailList = ({
    label,
    emails,
    setEmails,
    emailInput,
    setEmailInput,
  }: {
    label: string;
    emails: string[];
    setEmails: React.Dispatch<React.SetStateAction<string[]>>;
    emailInput: string;
    setEmailInput: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    // Using the same pattern as the tag input
    const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmailInput(e.target.value);
    };

    return (
      <div>
        <div className="mb-4 bg-violet-50 p-4 border-l rounded-lg">
          <p className="text-sm font-semibold text-gray-600">
            Add {label.toLowerCase()} by their email address. They must already
            be registered users in the system.
          </p>
        </div>

        <div className="flex space-x-2 mb-4">
          <input
            type="email"
            value={emailInput}
            onChange={handleEmailInputChange}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
            placeholder={`Enter ${label.toLowerCase()} email`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addEmail(emailInput, emails, setEmails, setEmailInput);
              }
            }}
          />
          <button
            type="button"
            onClick={() =>
              addEmail(emailInput, emails, setEmails, setEmailInput)
            }
            className="px-4 py-2 text-sm font-medium text-white bg-[#655967] border border-transparent rounded-md hover:bg-gray-700"
          >
            Add
          </button>
        </div>

        {emails.length > 0 ? (
          <div className="space-y-2">
            {emails.map((email) => (
              <div
                key={email}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <span className="text-sm">{email}</span>
                <button
                  type="button"
                  onClick={() => removeEmail(email, emails, setEmails)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No {label.toLowerCase()} added yet
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto mt-25 p-4 sm:p-6 lg:p-8">
      <div className="bg-gray-50 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {mode === "create" ? "Create New Event" : "Edit Event"}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="mb-8 ">
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
                  value={event.name}
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
                  value={event.format}
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
                  value={event.description}
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
                  value={formatDateForInput(event.startDate)}
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
                  value={formatDateForInput(event.endDate)}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Deadline (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="registrationDeadline"
                  value={formatDateForInput(event.registrationDeadline)}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium border-b pb-2 mb-4">Location</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(event.format === EVENT_FORMAT.PERSON ||
                event.format === EVENT_FORMAT.HYBRID) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address{" "}
                    {event.format === EVENT_FORMAT.PERSON ? "*" : "(Optional)"}
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={event.address}
                    onChange={handleEventChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required={event.format === EVENT_FORMAT.PERSON}
                  />
                </div>
              )}

              {(event.format === EVENT_FORMAT.ONLINE ||
                event.format === EVENT_FORMAT.HYBRID) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Virtual Platform Link{" "}
                    {event.format === EVENT_FORMAT.ONLINE ? "*" : "(Optional)"}
                  </label>
                  <input
                    type="url"
                    name="virtualPlatformLink"
                    value={event.virtualPlatformLink}
                    onChange={handleEventChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://..."
                    required={event.format === EVENT_FORMAT.ONLINE}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Capacity and Price Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium border-b pb-2 mb-4">
              Capacity and Pricing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity (Maximum Attendees) *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={event.capacity}
                  onChange={handleEventChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="isFree"
                    checked={event.isFree}
                    onChange={handleFreeToggle}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isFree"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    This is a free event
                  </label>
                </div>

                {!event.isFree && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={event.price}
                      onChange={handleEventChange}
                      min="0.01"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required={!event.isFree}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Agenda Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium border-b pb-2 mb-4">Agenda</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Agenda *
              </label>
              <textarea
                name="agenda"
                value={event.agenda?.toString()}
                onChange={handleEventChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Provide a detailed agenda for your event..."
                required
              ></textarea>
              <p className="mt-1 text-sm text-gray-500">
                Include speaker schedule, times, and session details.
              </p>
            </div>
          </div>

          {/* Banner Image Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium border-b pb-2 mb-4">
              Banner Image
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image URL *
              </label>
              <input
                type="text"
                name="bannerImage"
                value={event.bannerImage}
                onChange={handleEventChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://example.com/image.jpg"
                required
              />
              {event.bannerImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <img
                    src={event.bannerImage}
                    alt="Banner Preview"
                    className="h-40 w-full object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/800x400?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium border-b pb-2 mb-4">Tags</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Tags *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Add a tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#655967] border border-transparent rounded-md hover:bg-gray-700"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {event.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#655967] text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-[#655967] text-blue-800 hover:bg-gray-300"
                  >
                    <span className="sr-only">Remove {tag} tag</span>
                    <svg
                      className="h-2 w-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </span>
              ))}
              {event.tags?.length === 0 && (
                <p className="text-sm text-gray-500">No tags added yet</p>
              )}
            </div>
          </div>

          {/* People Sections */}
          {/* Event Admin Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium border-b pb-2 mb-4">
              Event Administrator
            </h2>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                You will be automatically assigned as the Event Administrator.
                As the admin, you'll be able to edit event details, manage
                participants, and view analytics.
              </p>
            </div>
          </div>

          {/* Organizers Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium border-b pb-2 mb-4">
              Organizers
            </h2>
            <EmailList
              label="Organizer"
              emails={organizerEmails}
              setEmails={setOrganizerEmails}
              emailInput={organizerEmailInput}
              setEmailInput={setOrganizerEmailInput}
            />
          </div>

          {/* Speakers Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium border-b pb-2 mb-4">Speakers</h2>
            <EmailList
              label="Speaker"
              emails={speakerEmails}
              setEmails={setSpeakerEmails}
              emailInput={speakerEmailInput}
              setEmailInput={setSpeakerEmailInput}
            />
          </div>

          {/* Sponsors Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium border-b pb-2 mb-4">Sponsors</h2>
            <EmailList
              label="Sponsor"
              emails={sponsorEmails}
              setEmails={setSponsorEmails}
              emailInput={sponsorEmailInput}
              setEmailInput={setSponsorEmailInput}
            />
          </div>

          {/* Stakeholders Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium border-b pb-2 mb-4">
              Stakeholders
            </h2>
            <EmailList
              label="Stakeholder"
              emails={stakeholderEmails}
              setEmails={setStakeholderEmails}
              emailInput={stakeholderEmailInput}
              setEmailInput={setStakeholderEmailInput}
            />
          </div>

          {/* Submit Section */}
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
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {mode === "create"
                    ? "Creating Event..."
                    : "Updating Event..."}
                </span>
              ) : mode === "create" ? (
                "Create Event"
              ) : (
                "Update Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
