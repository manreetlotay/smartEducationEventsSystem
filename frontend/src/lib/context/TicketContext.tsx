import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Ticket, USER_ROLE } from "../../lib/types/Ticket";
import { useAuth } from "../../lib/hooks/useAuth";

// Define the shape of the context
interface TicketContextType {
  tickets: Ticket[];
  userTickets: Ticket[];
  loading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  refreshTickets: () => Promise<void>;
}

// mock tickets
const mockTickets: Ticket[] = [
  {
    ticketId: "ticket123456",
    userId: "1", // This matches the current user id
    eventId: "1",
    role: USER_ROLE.ATTENDEE,
    qrCode: "qr-code-data",
    registrationDate: new Date("2025-03-15"),
  },
  {
    ticketId: "ticket789012",
    userId: "other-user", // This doesn't match current user
    eventId: "2",
    role: USER_ROLE.SPEAKER,
    accessCode: "SPEAKER2025",
    virtualLink: "https://virtual-event.example.com/join",
    registrationDate: new Date("2025-03-20"),
  },
  {
    ticketId: "ticket345678",
    userId: "another-user", // This doesn't match current user
    eventId: "event3",
    role: USER_ROLE.SPONSOR,
    qrCode: "qr-code-data-2",
    registrationDate: new Date("2025-04-01"),
  },
];

// Create the context with a default value
const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Props for the provider component
interface TicketProviderProps {
  children: ReactNode;
}

export const TicketProvider: React.FC<TicketProviderProps> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  // Function to fetch all tickets
  const fetchTickets = async (): Promise<void> => {
    try {
      // In a real app, this would be an API call
      // For now, using mock data
      setLoading(true);
      setError(null);

      // // Simulate network delay
      // await new Promise((resolve) => setTimeout(resolve, 100));

      setTickets(mockTickets);

      // Filter tickets for the current user if user exists
      if (user) {
        const filteredTickets = tickets.filter(
          (ticket) => String(ticket.userId) === String(user.id)
        );
        console.log("filtered tickets: ", filteredTickets);
        setUserTickets(filteredTickets);
        console.log(
          "user's id and all tickets",
          user.id,
          "and ticekts",
          tickets
        );
        console.log("after setting user tickets", userTickets);
      } else {
        setUserTickets([]);
      }
    } catch (err) {
      setError("Failed to fetch tickets. Please try again later.");
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh tickets (can be called after creating new tickets, etc.)
  const refreshTickets = async () => {
    await fetchTickets();
  };

  // Fetch tickets on mount and when user changes
  useEffect(() => {
    fetchTickets();
  }, [user?.id]); // Re-fetch when user ID changes

  // Create the context value object
  const contextValue: TicketContextType = {
    tickets,
    userTickets,
    loading,
    error,
    fetchTickets,
    refreshTickets,
  };

  return (
    <TicketContext.Provider value={contextValue}>
      {children}
    </TicketContext.Provider>
  );
};

// Custom hook to use the ticket context
export const useTickets = (): TicketContextType => {
  const context = useContext(TicketContext);

  if (context === undefined) {
    throw new Error("useTickets must be used within a TicketProvider");
  }

  return context;
};
