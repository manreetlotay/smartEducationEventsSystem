import React from "react";
import { BonusTicket } from "../../lib/types/Ticket";

const BonusTicketCard: React.FC<BonusTicket> = ({ accessCode }) => {
  return (
    <div className="relative">
      {/* Gold shimmer effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 opacity-20 rounded-lg"></div>

      {/* Main ticket container with gold border */}
      <div className="bg-white rounded-lg overflow-hidden shadow-lg border-4 border-yellow-500 relative z-10">
        {/* Top ticket part with premium gold gradient */}
        <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-500 px-4 py-4 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h3 className="font-bold text-xl tracking-wide">
              Golden Access Pass
            </h3>
          </div>
        </div>

        {/* Gold dotted line to create ticket tear effect */}
        <div className="border-b-2 border-dashed border-yellow-500"></div>

        {/* Ticket content */}
        <div className="p-6 bg-gradient-to-b from-white to-yellow-50">
          <div className="text-center mb-5">
            <span className="inline-block px-4 py-1 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-full border border-yellow-400">
              PREMIUM ACCESS
            </span>
          </div>

          <div className="text-center mb-4">
            <p className="text-gray-700 font-medium">
              This golden ticket grants you premium access to any event of your
              choice
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <div className="text-center">
              <span className="text-gray-500 text-sm">Access Code</span>
              <div className="font-bold font-mono text-xl text-yellow-800 tracking-wider mt-1">
                {accessCode}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <div className="h-12 w-40 relative">
              {/* Gold foil effect decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 rounded-md"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <span className="ml-2 font-bold text-yellow-800">VIP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket actions with gold gradient */}
        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-3 flex justify-between">
          <button className="text-sm text-yellow-700 hover:text-yellow-900 font-bold flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            Redeem
          </button>
          <button className="text-sm text-yellow-700 hover:text-yellow-900 font-bold flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* Corner decorations for extra flair */}
      <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-transparent rounded-tl-lg opacity-40"></div>
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-yellow-400 to-transparent rounded-tr-lg opacity-40"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-yellow-400 to-transparent rounded-bl-lg opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-yellow-400 to-transparent rounded-br-lg opacity-40"></div>
    </div>
  );
};

export default BonusTicketCard;
