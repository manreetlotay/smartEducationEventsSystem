import React from "react";
import { Ticket, USER_ROLE } from "../../lib/types/Ticket";

interface TicketCardProps {
  ticket: Ticket;
  eventName: string;
  eventEndDate: Date;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  eventName,
  eventEndDate,
}) => {
  const roleColors = {
    [USER_ROLE.ORGANIZER]: "bg-purple-100 text-purple-800",
    [USER_ROLE.ATTENDEE]: "bg-blue-100 text-blue-800",
    [USER_ROLE.SPEAKER]: "bg-red-100 text-red-800",
    [USER_ROLE.SPONSOR]: "bg-green-100 text-green-800",
    [USER_ROLE.STAKEHOLDER]: "bg-yellow-100 text-yellow-800",
    [USER_ROLE.EVENT_ADMIN]: "bg-gray-100 text-gray-800",
  };

  // Format date to be more readable
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isEventPast = new Date() > new Date(eventEndDate);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
      {/* Top ticket part with "tear" effect */}
      <div className="bg-[#655967] px-4 py-3 text-white flex justify-between items-center">
        <h3 className="font-bold truncate flex-1">{eventName}</h3>
      </div>

      {/* Dotted line to create ticket tear effect */}
      <div className="border-b border-dashed border-gray-300"></div>

      {/* Ticket content */}
      <div className="p-4">
        {/* Role badge */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Attending as:</span>
            <span
              className={`text-xs uppercase font-bold px-2 py-1 rounded-full ${
                roleColors[ticket.role]
              }`}
            >
              {ticket.role}
            </span>
          </div>
        </div>

        {/* Ticket details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Registration Date:</span>
            <span className="font-medium">
              {formatDate(ticket.registrationDate)}
            </span>
          </div>

          {ticket.accessCode && (
            <div className="flex justify-between">
              <span className="text-gray-500">Access Code:</span>
              <span className="font-medium font-mono">{ticket.accessCode}</span>
            </div>
          )}

          {ticket.virtualLink && (
            <div className="mt-3">
              <a
                href={ticket.virtualLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-indigo-100 text-indigo-700 py-2 rounded font-medium hover:bg-indigo-200 transition-colors"
              >
                Join Virtual Event
              </a>
            </div>
          )}

          {/* New section for post-event link */}
          {isEventPast && (
            <div className="mt-3">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSco6Sv2Vfzi54kQR9X-arvFA8UBAIT12gEABd3oxrm7Y9-NyA/viewform?usp=sharing" // Replace with actual resource link
                className="block w-full text-center bg-green-100 text-green-700 py-2 rounded font-medium hover:bg-green-200 transition-colors"
              >
                Access Post-Event Survey
              </a>
            </div>
          )}

          {ticket.qrCode && (
            <div className="flex justify-center mt-2">
              <div className="bg-gray-100 p-2 rounded-md">
                {/* Placeholder for QR code image */}
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-500">QR Code</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ticket actions */}
      <div className="bg-gray-50 px-4 py-3 flex justify-end">
        <button className="text-sm text-gray-600 hover:text-gray-800 font-bold">
          Download
        </button>
      </div>
    </div>
  );
};

export default TicketCard;
