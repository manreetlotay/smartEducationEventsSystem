import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Event, EVENT_FORMAT } from "../types/Events";

// Mock data - Will be replaced with API calls in production
const mockEvents: Event[] = [
  {
    id: "1",
    name: "Annual Tech Conference 2025",
    description:
      "Join us for three days of inspiring talks and workshops on the latest technology trends and innovations. Network with industry leaders and gain insights into cutting-edge developments.",
    format: EVENT_FORMAT.HYBRID,
    tags: ["Technology", "Innovation", "Networking"],
    bannerImage:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80",
    startDate: new Date("2025-04-15T09:00:00"),
    endDate: new Date("2025-04-17T17:00:00"),
    capacity: 500,
    registrationDeadline: new Date("2025-04-01T23:59:59"),
    address: "123 Tech Boulevard, San Francisco, CA 94105",
    virtualPlatformLink:
      "https://virtual-conference-platform.com/tech2025",
    isFree: true,
    price: 0,
    agenda:
      "Day 1: Opening Keynote (9:00 AM - 10:30 AM), Workshop Sessions (11:00 AM - 5:00 PM)\n\nDay 2: Industry Panel (9:00 AM - 11:00 AM), Tech Demos (1:00 PM - 5:00 PM)\n\nDay 3: Networking Event (9:00 AM - 12:00 PM), Closing Remarks (3:00 PM - 4:30 PM)",
    organizers: [
      {
        id: "org1",
        email: "techorg@example.com",
        password: "",
        phoneNumber: "415-555-1234",
        profileImage:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        userType: "organization",
        points: 0,
        firstName: "",
        lastName: "",
        organizationName: "TechConf Inc.",
        organizationAddress: "100 Market Street, San Francisco, CA 94103",
        is_site_admin: false,
      },
    ],
    sponsors: [
      {
        id: "spon1",
        email: "sponsor@example.com",
        password: "",
        phoneNumber: "415-555-9876",
        profileImage:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        userType: "organization",
        points: 0,
        firstName: "",
        lastName: "",
        organizationName: "Future Tech Industries",
        organizationAddress: "200 Mission Street, San Francisco, CA 94105",
        is_site_admin: false,
      },
    ],
    speakers: [
      {
        id: "speak1",
        email: "jane.doe@example.com",
        password: "",
        phoneNumber: "415-555-5678",
        profileImage:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        userType: "individual",
        profession: "AI Researcher",
        points: 0,
        firstName: "Jane",
        lastName: "Doe",
        affiliation: "Tech University",
        organizationName: "",
        organizationAddress: "",
        is_site_admin: false,
      },
    ],
    attendees: [],
    stakeholders: [],
    eventAdmin: {
      id: "admin1",
      email: "admin@example.com",
      password: "",
      phoneNumber: "415-555-2345",
      profileImage:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      userType: "individual",
      points: 0,
      firstName: "Admin",
      lastName: "User",
      organizationName: "",
      organizationAddress: "",
      is_site_admin: false,
    },
  },
  // ...additional mock events
];

// Define the shape of our context
interface EventContextType {
  events: Event[];
  allTags: string[];
  allFormats: EVENT_FORMAT[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  getEventById: (id: string) => Event | undefined;
  updateEvent: (id: string, updatedEvent: Event) => Promise<void>;
}

// Create the context with default values
const EventContext = createContext<EventContextType>({
  events: [],
  allTags: [],
  allFormats: Object.values(EVENT_FORMAT),
  loading: false,
  error: null,
  fetchEvents: async () => {},
  getEventById: () => undefined,
  updateEvent: async () => {},
});

// Provider component
interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Compute derived state
  const allTags = Array.from(new Set(events.flatMap((event) => event.tags)));
  const allFormats = Object.values(EVENT_FORMAT);

  // Function to fetch events
  const fetchEvents = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setEvents(mockEvents);
    } catch (err) {
      setError("Failed to fetch events");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to get an event by ID
  const getEventById = (id: string): Event | undefined => {
    return events.find((event) => event.id === id);
  };

  // Update event function that calls the backend PATCH endpoint
  const updateEvent = async (id: string, updatedEvent: Event): Promise<void> => {
    try {
      const response = await fetch(`/events/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });
      if (!response.ok) {
        throw new Error("Failed to update event");
      }
      const updatedEventFromServer: Event = await response.json();
      // Update local state with the updated event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === id ? updatedEventFromServer : event
        )
      );
    } catch (err) {
      console.error("Error updating event:", err);
      throw err;
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const contextValue: EventContextType = {
    events,
    allTags,
    allFormats,
    loading,
    error,
    fetchEvents,
    getEventById,
    updateEvent,
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook to use the event context
export const useEventContext = () => useContext(EventContext);

export default EventContext;
