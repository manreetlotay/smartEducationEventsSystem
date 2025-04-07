import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Event, EVENT_FORMAT } from "../types/Events";
import { Ticket, USER_ROLE } from "../types/Ticket";
import { User } from "../types/User";

const API_BASE_URL = "http://localhost:8000";

// Mock data for fallback if needed
const mockEvents: Event[] = [
  {
    id: "1",
    name: "Annual Tech Conference 2025",
    description:
      "Join us for three days of inspiring talks and workshops on the latest technology trends and innovations.",
    format: EVENT_FORMAT.HYBRID,
    tags: ["Technology", "Innovation", "Networking"],
    bannerImage:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80",
    startDate: new Date("2025-04-15T09:00:00"),
    endDate: new Date("2025-04-17T17:00:00"),
    capacity: 500,
    registrationDeadline: new Date("2025-04-01T23:59:59"),
    address: "123 Tech Boulevard, San Francisco, CA 94105",
    virtualPlatformLink: "https://virtual-conference-platform.com/tech2025",
    isFree: true,
    price: 0,
    agenda:
      "Day 1: Opening Keynote (9:00 AM - 10:30 AM), Workshop Sessions (11:00 AM - 5:00 PM)\n\nDay 2: Industry Panel (9:00 AM - 11:00 AM), Tech Demos (1:00 PM - 5:00 PM)\n\nDay 3: Networking Event (9:00 AM - 12:00 PM), Closing Remarks (3:00 PM - 4:30 PM)",
    organizers: [],
    sponsors: [],
    speakers: [],
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
  // Additional mock events can be added here
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

// Helper function to convert backend event format to frontend format
const mapBackendEventToFrontend = (backendEvent: any): Event => {
  return {
    id: backendEvent.id ? backendEvent.id.toString() : "0",
    name: backendEvent.name || "",
    description: backendEvent.description || "",
    format: backendEvent.event_format || EVENT_FORMAT.ONLINE,
    tags: backendEvent.tags || [],
    bannerImage:
      backendEvent.banner_image ||
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80",
    startDate: new Date(backendEvent.start_date || new Date()),
    endDate: new Date(backendEvent.end_date || new Date()),
    capacity: backendEvent.capacity || 0,
    registrationDeadline: backendEvent.registration_deadline
      ? new Date(backendEvent.registration_deadline)
      : undefined,
    address: backendEvent.address || "",
    virtualPlatformLink: backendEvent.virtual_link || "",
    isFree: backendEvent.is_free !== undefined ? backendEvent.is_free : true,
    price: backendEvent.price || 0,
    agenda: backendEvent.agenda || "",
    organizers: [], // Will be populated later
    sponsors: [], // Will be populated later
    speakers: [], // Will be populated later
    attendees: [], // Will be populated later
    stakeholders: [], // Will be populated later
    eventAdmin: {
      id: backendEvent.admin_id ? backendEvent.admin_id.toString() : "0",
      email: "",
      password: "",
      phoneNumber: "",
      profileImage: "",
      userType: "individual",
      points: 0,
      firstName: "",
      lastName: "",
      organizationName: "",
      organizationAddress: "",
      is_site_admin: false,
    }, // Admin details will be completed later
  };
};

// Function to convert frontend event to backend format for updates
const mapFrontendEventToBackend = (frontendEvent: Event): any => {
  return {
    name: frontendEvent.name,
    description: frontendEvent.description,
    event_format: frontendEvent.format,
    tags: frontendEvent.tags,
    banner_image: frontendEvent.bannerImage,
    start_date: frontendEvent.startDate.toISOString(),
    end_date: frontendEvent.endDate.toISOString(),
    capacity: frontendEvent.capacity,
    registration_deadline: frontendEvent.registrationDeadline?.toISOString(),
    address: frontendEvent.address,
    virtual_link: frontendEvent.virtualPlatformLink,
    is_free: frontendEvent.isFree,
    price: frontendEvent.price,
    agenda: frontendEvent.agenda,
    admin_id: frontendEvent.eventAdmin.id
      ? parseInt(frontendEvent.eventAdmin.id)
      : 0,
  };
};

// Add this after the mapBackendEventToFrontend function
const mapBackendUserToFrontend = (backendUser: any): User => {
  // Check if backend uses snake_case
  const usesSnakeCase =
    "first_name" in backendUser ||
    "last_name" in backendUser ||
    "phone_number" in backendUser;

  if (usesSnakeCase) {
    return {
      id: String(backendUser.id),
      firstName: backendUser.first_name || "",
      lastName: backendUser.last_name || "",
      email: backendUser.email || "",
      password: "",
      phoneNumber: backendUser.phone_number || "",
      profileImage: backendUser.profile_image || "",
      userType: backendUser.user_type || "individual",
      profession: backendUser.profession || "",
      points: backendUser.points || 0,
      affiliation: backendUser.affiliation || "",
      organizationName: backendUser.organization_name || "",
      organizationAddress: backendUser.organization_address || "",
      is_site_admin: backendUser.is_site_admin || false,
    };
  } else {
    // Backend already uses camelCase
    return {
      id: String(backendUser.id),
      firstName: backendUser.firstName || "",
      lastName: backendUser.lastName || "",
      email: backendUser.email || "",
      password: "",
      phoneNumber: backendUser.phoneNumber || "",
      profileImage: backendUser.profileImage || "",
      userType: backendUser.userType || "individual",
      profession: backendUser.profession || "",
      points: backendUser.points || 0,
      affiliation: backendUser.affiliation || "",
      organizationName: backendUser.organizationName || "",
      organizationAddress: backendUser.organizationAddress || "",
      is_site_admin: backendUser.is_site_admin || false,
    };
  }
};

const mapBackendTicketToFrontend = (backendTicket: any): Ticket => {
  return {
    ticketId: String(backendTicket.id || backendTicket.ticket_id || "0"),
    userId: String(backendTicket.user_id || "0"),
    eventId: String(backendTicket.event_id || "0"),
    role: backendTicket.role || USER_ROLE.ATTENDEE,
    accessCode: backendTicket.access_code,
    virtualLink: backendTicket.virtual_link,
    qrCode: backendTicket.qr_code,
    registrationDate: new Date(backendTicket.registration_date || new Date()),
  };
};

const mapFrontendTicketToBackend = (frontendTicket: Ticket): any => {
  return {
    user_id: parseInt(frontendTicket.userId),
    event_id: parseInt(frontendTicket.eventId),
    role: frontendTicket.role,
    access_code: frontendTicket.accessCode,
    virtual_link: frontendTicket.virtualLink,
    qr_code: frontendTicket.qrCode,
    registration_date: frontendTicket.registrationDate.toISOString(),
  };
};

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

  const fetchEvents = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch events from API
      const eventsResponse = await fetch(`${API_BASE_URL}/events`);
      if (!eventsResponse.ok) {
        throw new Error(`Failed to fetch events: ${eventsResponse.status}`);
      }
      const eventsData = await eventsResponse.json();

      // Map backend events to frontend format
      const initialEvents: Event[] = eventsData.map(mapBackendEventToFrontend);

      // 2. Fetch all tickets
      const ticketsResponse = await fetch(`${API_BASE_URL}/tickets`);
      if (!ticketsResponse.ok) {
        throw new Error(`Failed to fetch tickets: ${ticketsResponse.status}`);
      }
      const ticketsData = await ticketsResponse.json();
      const tickets: Ticket[] = ticketsData.map(mapBackendTicketToFrontend);

      // 3. Fetch all user details
      const usersResponse = await fetch(`${API_BASE_URL}/users`);
      if (!usersResponse.ok) {
        throw new Error(`Failed to fetch users: ${usersResponse.status}`);
      }
      const usersData = await usersResponse.json();
      const allUsers: User[] = usersData.map(mapBackendUserToFrontend);

      // Create a map of users by ID for quick lookup
      const usersMap = new Map<string, User>();
      allUsers.forEach((user) => {
        usersMap.set(String(user.id), user);
      });

      // 4. Populate events with user details based on tickets
      const populatedEvents = initialEvents.map((event) => {
        const eventTickets = tickets.filter(
          (ticket) => String(ticket.eventId) === String(event.id)
        );

        // Group users by their roles
        const organizers: User[] = [];
        const sponsors: User[] = [];
        const speakers: User[] = [];
        const attendees: User[] = [];
        const stakeholders: User[] = [];

        // Find the admin user for this event
        const adminUser = allUsers.find(
          (user) => String(user.id) === String(event.eventAdmin.id)
        );

        // Update the event admin with full user details if found
        const updatedEventAdmin = adminUser
          ? {
              ...adminUser,
            }
          : event.eventAdmin;

        // Process tickets to populate user arrays by role
        eventTickets.forEach((ticket) => {
          const user = usersMap.get(String(ticket.userId));
          if (user) {
            switch (ticket.role) {
              case USER_ROLE.ORGANIZER:
                organizers.push({ ...user });
                break;
              case USER_ROLE.SPONSOR:
                sponsors.push({ ...user });
                break;
              case USER_ROLE.SPEAKER:
                speakers.push({ ...user });
                break;
              case USER_ROLE.ATTENDEE:
                attendees.push({ ...user });
                break;
              case USER_ROLE.STAKEHOLDER:
                stakeholders.push({ ...user });
                break;
              case USER_ROLE.EVENT_ADMIN:
                // If we find an admin in the tickets, use that instead
                // But we don't override the updatedEventAdmin already set
                break;
            }
          }
        });

        return {
          ...event,
          organizers,
          sponsors,
          speakers,
          attendees,
          stakeholders,
          eventAdmin: updatedEventAdmin,
        };
      });

      setEvents(populatedEvents);
    } catch (err: any) {
      setError(`Failed to fetch events: ${err.message}`);
      console.error("Error fetching events:", err);
      // Optionally fall back to mock data
      // setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  // Function to get an event by ID
  const getEventById = (id: string): Event | undefined => {
    return events.find((event) => event.id === id);
  };

  // Update event function that calls the backend PATCH endpoint
  const updateEvent = async (
    id: string,
    updatedEvent: Event
  ): Promise<void> => {
    try {
      // Convert from frontend to backend format
      const backendEvent = mapFrontendEventToBackend(updatedEvent);

      console.log(`Updating event ${id} with data:`, backendEvent);

      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendEvent),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to update event: ${response.status}`, errorText);
        throw new Error(`Failed to update event: ${response.status}`);
      }

      // Re-fetch all events to get the latest data
      await fetchEvents();
    } catch (err: any) {
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
