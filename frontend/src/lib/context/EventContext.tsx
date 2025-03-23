import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Event, EVENT_FORMAT } from "../types/Events";
import { USER_TYPE } from "../types/User";

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
    virtualPlatformLink: "https://virtual-conference-platform.com/tech2025",
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
        profileImage: "/images/tech-organization.jpg",
        userType: USER_TYPE.ORGANIZATION,
        points: 0,
        firstName: "",
        lastName: "",
        organizationName: "TechConf Inc.",
        organizationAddress: "100 Market Street, San Francisco, CA 94103",
      },
    ],
    sponsors: [
      {
        id: "spon1",
        email: "sponsor@example.com",
        password: "",
        phoneNumber: "415-555-9876",
        profileImage: "/images/sponsor-logo.jpg",
        userType: USER_TYPE.ORGANIZATION,
        points: 0,
        firstName: "",
        lastName: "",
        organizationName: "Future Tech Industries",
        organizationAddress: "200 Mission Street, San Francisco, CA 94105",
      },
    ],
    speakers: [
      {
        id: "speak1",
        email: "jane.doe@example.com",
        password: "",
        phoneNumber: "415-555-5678",
        profileImage: "/images/jane-doe.jpg",
        userType: USER_TYPE.INDIVIDUAL,
        profession: "AI Researcher",
        points: 0,
        firstName: "Jane",
        lastName: "Doe",
        affiliation: "Tech University",
        organizationName: "",
        organizationAddress: "",
      },
    ],
    attendees: [],
    stakeholders: [],
    eventAdmin: {
      id: "admin1",
      email: "admin@example.com",
      password: "",
      phoneNumber: "415-555-2345",
      profileImage: "/images/admin.jpg",
      userType: USER_TYPE.INDIVIDUAL,
      points: 0,
      firstName: "Admin",
      lastName: "User",
      organizationName: "",
      organizationAddress: "",
    },
  },
  {
    id: "2",
    name: "Virtual Marketing Workshop",
    description:
      "A comprehensive online workshop for marketing professionals looking to enhance their digital marketing skills.",
    format: EVENT_FORMAT.ONLINE,
    tags: ["Marketing", "Digital", "Workshop"],
    bannerImage:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80",
    startDate: new Date("2025-05-10T10:00:00"),
    endDate: new Date("2025-05-10T16:00:00"),
    capacity: 200,
    registrationDeadline: new Date("2025-05-05T23:59:59"),
    virtualPlatformLink: "https://zoom.us/marketing-workshop",
    isFree: false,
    price: 49.99,
    agenda:
      "10:00 AM - 11:30 AM: SEO Fundamentals\n\n12:00 PM - 1:30 PM: Social Media Strategy\n\n2:00 PM - 3:30 PM: Content Marketing\n\n3:30 PM - 4:00 PM: Q&A Session",
    organizers: [
      {
        id: "org2",
        email: "digitalmarketing@example.com",
        password: "",
        phoneNumber: "415-555-6789",
        profileImage: "/images/digital-marketing.jpg",
        userType: USER_TYPE.ORGANIZATION,
        points: 0,
        firstName: "",
        lastName: "",
        organizationName: "Digital Marketing Experts",
        organizationAddress: "456 Market Street, San Francisco, CA 94103",
      },
    ],
    sponsors: [],
    speakers: [
      {
        id: "speak3",
        email: "sarah.johnson@example.com",
        password: "",
        phoneNumber: "415-555-8765",
        profileImage: "/images/sarah-johnson.jpg",
        userType: USER_TYPE.INDIVIDUAL,
        profession: "Marketing Director",
        points: 0,
        firstName: "Sarah",
        lastName: "Johnson",
        affiliation: "Marketing Innovations Ltd.",
        organizationName: "",
        organizationAddress: "",
      },
    ],
    attendees: [],
    stakeholders: [],
    eventAdmin: {
      id: "admin2",
      email: "marketing.admin@example.com",
      password: "",
      phoneNumber: "415-555-7890",
      profileImage: "/images/admin2.jpg",
      userType: USER_TYPE.INDIVIDUAL,
      points: 0,
      firstName: "Marketing",
      lastName: "Admin",
      organizationName: "",
      organizationAddress: "",
    },
  },
  {
    id: "3",
    name: "Local Networking Meetup",
    description:
      "Connect with professionals in your area over coffee and light refreshments. Exchange ideas and build valuable business relationships.",
    format: EVENT_FORMAT.PERSON,
    tags: ["Networking", "Business", "Local"],
    bannerImage:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80",
    startDate: new Date("2025-06-05T18:00:00"),
    endDate: new Date("2025-06-05T20:00:00"),
    capacity: 50,
    address: "The Business Hub, 789 Oak Street, San Francisco, CA 94107",
    isFree: true,
    price: 0,
    agenda:
      "6:00 PM - 6:30 PM: Check-in and refreshments\n\n6:30 PM - 7:30 PM: Structured networking\n\n7:30 PM - 8:00 PM: Open networking",
    organizers: [
      {
        id: "org3",
        email: "businessnetwork@example.com",
        password: "",
        phoneNumber: "415-555-3456",
        userType: USER_TYPE.ORGANIZATION,
        points: 0,
        firstName: "",
        lastName: "",
        organizationName: "SF Business Network",
        organizationAddress: "789 Oak Street, San Francisco, CA 94107",
      },
    ],
    sponsors: [],
    speakers: [],
    attendees: [],
    stakeholders: [],
    eventAdmin: {
      id: "admin3",
      email: "network.admin@example.com",
      password: "",
      phoneNumber: "415-555-6543",
      userType: USER_TYPE.INDIVIDUAL,
      points: 0,
      firstName: "Network",
      lastName: "Coordinator",
      organizationName: "",
      organizationAddress: "",
    },
  },
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

      // In a real implementation, this would be an API call
      // const response = await fetch('/api/events');
      // const data = await response.json();

      // Using mock data for now
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

  // Initial fetch on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // The context value that will be provided
  const contextValue: EventContextType = {
    events,
    allTags,
    allFormats,
    loading,
    error,
    fetchEvents,
    getEventById,
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
