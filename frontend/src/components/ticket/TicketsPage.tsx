import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, USER_ROLE } from "../../lib/types/Ticket";
import { useEventContext } from "../../lib/context/EventContext";
import { TicketIcon } from "@heroicons/react/20/solid";
import TicketCard from "./TicketCard";
import BonusTicketCard from "./BonusTicketCard";
import { useAuth } from "../../lib/hooks/useAuth";

const MyTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const { events, loading: contextLoading } = useEventContext();
  const [myTickets, setMyTickets] = useState<
    Array<Ticket & { eventName: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const currentUserId = "id";

  // Fetch tickets for the current user
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // This would typically be an API call to get the user's tickets
        // For now, we'll use mock data
        const mockTickets: Ticket[] = [
          {
            ticketId: "ticket123456",
            userId: currentUserId,
            eventId: "1",
            role: USER_ROLE.ATTENDEE,
            qrCode: "qr-code-data",
            registrationDate: new Date("2025-03-15"),
          },
          {
            ticketId: "ticket789012",
            userId: currentUserId,
            eventId: "2",
            role: USER_ROLE.SPEAKER,
            accessCode: "SPEAKER2025",
            virtualLink: "https://virtual-event.example.com/join",
            registrationDate: new Date("2025-03-20"),
          },
          {
            ticketId: "ticket345678",
            userId: currentUserId,
            eventId: "event3",
            role: USER_ROLE.SPONSOR,
            qrCode: "qr-code-data-2",
            registrationDate: new Date("2025-04-01"),
          },
        ];

        // Add event names to tickets by looking up events
        if (events.length > 0) {
          const ticketsWithEventNames = mockTickets.map((ticket) => {
            const event = events.find((e) => e.id === ticket.eventId);
            return {
              ...ticket,
              eventName: event ? event.name : "Unknown Event",
            };
          });
          setMyTickets(ticketsWithEventNames);
        } else {
          // If no events found, just use placeholder names
          const ticketsWithPlaceholders = mockTickets.map((ticket) => ({
            ...ticket,
            eventName: `Event ${ticket.eventId}`,
          }));
          setMyTickets(ticketsWithPlaceholders);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setLoading(false);
      }
    };

    if (!contextLoading) {
      fetchTickets();
    }
  }, [events, contextLoading, currentUserId]);

  // Check if the user has any tickets
  const hasTickets = myTickets.length > 0;

  // Generate a random access code for the bonus ticket
  const generateAccessCode = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed similar looking characters
    let result = "GOLD-";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  return (
    <>
      <div className="max-w-7xl mx-auto mt-30 px-4 py-8 mt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
          <button
            onClick={() => navigate("/events")}
            className="px-4 py-2 bg-[#655967] text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Browse Events
          </button>
        </div>

        {loading || contextLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div>
            {/* Bonus Ticket Section - Only show if user has enough points */}
            {user && user.points >= 500 && (
              <div className="mb-8">
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 p-4 mb-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707L15.414 5a1 1 0 01-1.414 1.414L13 5.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707 1.414-1.414zM15 11a1 1 0 01.707.293l.707.707L17.414 13a1 1 0 01-1.414 1.414L15 13.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707 1.414-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-yellow-800">
                        Congratulations!
                      </h3>
                      <p className="mt-1 text-sm text-yellow-700">
                        You've earned a Golden Access Pass with your{" "}
                        {user.points} points. Use it to attend any event of your
                        choice!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="max-w-2xl mx-auto">
                  <BonusTicketCard accessCode={generateAccessCode()} />
                </div>

                <div className="border-b border-gray-200 my-8"></div>
              </div>
            )}

            {hasTickets ? (
              <div>
                <div className="bg-violet-50 border-l-4 border-gray-500 p-4 mb-6">
                  <p className="text-gray-700">
                    View and manage your event tickets here. Access codes for
                    virtual events can be used to join online.
                  </p>
                </div>
                <div className="grid grid-cols-1 max-w-2xl mx-auto gap-6">
                  {myTickets.map((ticket) => (
                    <div
                      key={ticket.ticketId}
                      className="transform transition-transform hover:scale-[1.02]"
                    >
                      <TicketCard
                        ticket={ticket}
                        eventName={ticket.eventName}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <TicketIcon className="h-8 w-auto" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  You don't have any tickets yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Register for events to get your tickets here. Your tickets
                  will give you access to events, whether they're in-person or
                  virtual.
                </p>
                <button
                  onClick={() => navigate("/events")}
                  className="px-6 py-2 bg-[#655967] text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Find Events
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MyTicketsPage;
