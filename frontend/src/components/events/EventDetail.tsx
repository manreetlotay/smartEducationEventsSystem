// EventDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { EventDet } from "../../lib/types/Events";
import PageNotFound from "../status/PageNotFound";

// Mock function to get event by ID - replace with your actual data fetching
const getEventById = (id: string): EventDet | undefined => {
  // This would normally be a fetch or API call
  const mockEvents: EventDet[] = [
    {
      id: "1",
      title: "Tech Conference 2025",
      description:
        "Join us for our annual tech conference featuring the latest innovations in AI, blockchain, and more. Network with industry leaders, attend workshops, and gain insights from keynote speakers at the forefront of technology. This three-day event includes catered lunches, an evening reception, and opportunities for one-on-one mentoring sessions with experts.",
      date: new Date("2025-04-15T10:00:00"),
      endDate: new Date("2025-04-15T18:00:00"),
      isFree: false,
      price: 299,
      tags: ["Technology", "Conference", "Networking", "AI", "Blockchain"],
      location: "San Francisco Convention Center",
      address: "747 Howard St, San Francisco, CA 94103",
      organizer: "TechVision Media",
      imageUrl:
        "https://tailwindui.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
      attendees: 842,
      capacity: 1000,
    },
    {
      id: "2",
      title: "Community Cleanup",
      description:
        "Help make our community better by joining our park cleanup initiative. We provide all cleaning supplies, gloves, and refreshments. This is a family-friendly event and a great way to meet neighbors while making a positive impact on our environment. Volunteers will receive a commemorative t-shirt.",
      date: new Date("2025-03-22T09:00:00"),
      endDate: new Date("2025-03-22T13:00:00"),
      isFree: true,
      price: 0,
      tags: ["Community", "Environment", "Volunteer", "Outdoors"],
      location: "Lincoln Park",
      address: "500 W Armitage Ave, Chicago, IL 60614",
      organizer: "Green Community Initiative",
      imageUrl:
        "https://tailwindui.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
      attendees: 124,
      capacity: 200,
    },
  ];

  return mockEvents.find((event) => event.id === id);
};

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDet | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const foundEvent = getEventById(id);
      setEvent(foundEvent);
      setLoading(false);
    }
  }, [id]);

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const registerForEvent = () => {
    // This would normally submit a form or make an API call
    alert(`You've registered for ${event?.title}!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#49475B]"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <PageNotFound message="Sorry, the event you are looking for does not exist." />
      </div>
    );
  }

  // Calculate remaining spots
  const remainingSpots = event.capacity
    ? event.capacity - event.attendees
    : "Unlimited";
  // Calculate if event is nearly full (90% capacity)
  const isNearlyFull =
    event.capacity && event.attendees >= event.capacity * 0.9;

  return (
    <div className="max-w-6xl mx-auto px-4 mt-30 relative z-10">
      {/* Main content card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Title and tags section */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#49475B] bg-opacity-10 text-[#49475B] dark:text-[#b5b3c7] text-sm font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Organized by{" "}
                <span className="font-medium">{event.organizer}</span>
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
              {event.isFree ? (
                <span className="px-4 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-medium rounded-full text-sm">
                  Free Event
                </span>
              ) : (
                <div className="text-2xl font-bold text-[#49475B] dark:text-[#b5b3c7]">
                  ${event.price}
                </div>
              )}
            </div>
          </div>

          {/* Two column layout for details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column with description */}
            <div className="lg:col-span-2">
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  About This Event
                </h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Right column with event details */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Event Details
                </h2>

                <div className="space-y-4">
                  {/* Date and time */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="h-5 w-5 text-[#49475B] dark:text-[#b5b3c7]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Date & Time
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {formatDateTime(event.date)}
                      </p>
                      {event.endDate && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          to {formatDateTime(event.endDate)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="h-5 w-5 text-[#49475B] dark:text-[#b5b3c7]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Location
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {event.location}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {event.address}
                      </p>
                    </div>
                  </div>

                  {/* Capacity */}
                  {event.capacity && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          className="h-5 w-5 text-[#49475B] dark:text-[#b5b3c7]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          Capacity
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {event.attendees} attending • {remainingSpots} spots
                          left
                        </p>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full ${
                              isNearlyFull ? "bg-red-500" : "bg-[#49475B]"
                            }`}
                            style={{
                              width: `${
                                (event.attendees / event.capacity) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Registration button */}
                <button
                  onClick={registerForEvent}
                  className="w-full mt-6 px-6 py-3 bg-[#49475B] text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#49475B]"
                >
                  {event.isFree ? "Register for Free" : "Register Now"}
                </button>

                {isNearlyFull && (
                  <p className="text-center text-sm text-red-500 dark:text-red-400 mt-2">
                    Almost sold out! Register soon.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
