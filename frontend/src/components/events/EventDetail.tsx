// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Event, EVENT_FORMAT } from "../../lib/types/Events";
// import { User, USER_TYPE } from "../../lib/types/User";
// import PageNotFound from "../status/PageNotFound";
// import PaymentPage from "../payment/PaymentPage";

// const EventDetail: React.FC = () => {
//   const { eventId } = useParams<{ eventId: string }>();
//   const navigate = useNavigate();

//   // Updated mock data to match new Event interface
//   const [event, setEvent] = useState<Event>({
//     id: "1",
//     name: "Annual Tech Conference 2025",
//     description:
//       "Join us for three days of inspiring talks and workshops on the latest technology trends and innovations. Network with industry leaders and gain insights into cutting-edge developments.",
//     format: EVENT_FORMAT.HYBRID,
//     tags: ["Technology", "Innovation", "Networking"],
//     bannerImage: "/images/tech-conference.jpg",
//     startDate: new Date("2025-04-15T09:00:00"),
//     endDate: new Date("2025-04-17T17:00:00"),
//     capacity: 500,
//     registrationDeadline: new Date("2025-04-01T23:59:59"),
//     address: "123 Tech Boulevard, San Francisco, CA 94105",
//     virtualPlatformLink: "https://virtual-conference-platform.com/tech2025",
//     isFree: false,
//     price: 20,
//     agenda:
//       "Day 1: Opening Keynote (9:00 AM - 10:30 AM), Workshop Sessions (11:00 AM - 5:00 PM)\nDay 2: Industry Panel (9:00 AM - 11:00 AM), Tech Demos (1:00 PM - 5:00 PM)\nDay 3: Networking Event (9:00 AM - 12:00 PM), Closing Remarks (3:00 PM - 4:30 PM)",
//     organizers: [
//       {
//         id: "org1",
//         email: "techorg@example.com",
//         password: "",
//         phoneNumber: "415-555-1234",
//         profileImage: "/images/tech-organization.jpg",
//         userType: USER_TYPE.ORGANIZATION,
//         points: 0,
//         firstName: "",
//         lastName: "",
//         organizationName: "TechConf Inc.",
//         organizationAddress: "100 Market Street, San Francisco, CA 94103",
//       },
//     ],
//     sponsors: [
//       {
//         id: "spon1",
//         email: "sponsor@example.com",
//         password: "",
//         phoneNumber: "415-555-9876",
//         profileImage: "/images/sponsor-logo.jpg",
//         userType: USER_TYPE.ORGANIZATION,
//         points: 0,
//         firstName: "",
//         lastName: "",
//         organizationName: "Future Tech Industries",
//         organizationAddress: "200 Mission Street, San Francisco, CA 94105",
//       },
//     ],
//     speakers: [
//       {
//         id: "speak1",
//         email: "jane.doe@example.com",
//         password: "",
//         phoneNumber: "415-555-5678",
//         profileImage: "/images/jane-doe.jpg",
//         userType: USER_TYPE.INDIVIDUAL,
//         profession: "AI Researcher",
//         points: 0,
//         firstName: "Jane",
//         lastName: "Doe",
//         affiliation: "Tech University",
//         organizationName: "",
//         organizationAddress: "",
//       },
//       {
//         id: "speak2",
//         email: "john.smith@example.com",
//         password: "",
//         phoneNumber: "415-555-4321",
//         profileImage: "/images/john-smith.jpg",
//         userType: USER_TYPE.INDIVIDUAL,
//         profession: "Software Architect",
//         points: 0,
//         firstName: "John",
//         lastName: "Smith",
//         affiliation: "Innovative Solutions Inc.",
//         organizationName: "",
//         organizationAddress: "",
//       },
//     ],
//     attendees: [],
//     stakeholders: [
//       {
//         id: "stake1",
//         email: "community@example.com",
//         password: "",
//         phoneNumber: "415-555-8765",
//         userType: USER_TYPE.ORGANIZATION,
//         points: 0,
//         firstName: "",
//         lastName: "",
//         organizationName: "Local Tech Community",
//         organizationAddress: "300 Howard Street, San Francisco, CA 94105",
//       },
//     ],
//     eventAdmin: {
//       id: "admin1",
//       email: "admin@example.com",
//       password: "",
//       phoneNumber: "415-555-2345",
//       profileImage: "/images/admin.jpg",
//       userType: USER_TYPE.INDIVIDUAL,
//       points: 0,
//       firstName: "Admin",
//       lastName: "User",
//       organizationName: "",
//       organizationAddress: "",
//     },
//   });

//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState("");
//   const [showPaymentPage, setShowPaymentPage] = useState(false);

//   // Fetch event details based on ID
//   useEffect(() => {
//     const fetchEventDetail = async () => {
//       try {
//         setLoading(true);
//         // Replace with your actual API call
//         // const response = await fetch(`/api/events/${eventId}`);
//         // const data = await response.json();

//         // Here we would normally set the event data from the API
//         // For now, we're using the mock data already set in state
//         // but in a real implementation we'd do something like:
//         // setEvent(data);

//         // Just setting loading to false for the mock data
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load event details");
//         setLoading(false);
//         console.error(err);
//       }
//     };

//     fetchEventDetail();
//   }, [eventId]);

//   const formatDateTime = (date: Date) => {
//     return new Intl.DateTimeFormat("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "numeric",
//       minute: "numeric",
//     }).format(date);
//   };

//   const registerForEvent = () => {
//     if (!event) return;

//     if (event.isFree) {
//       // Handle free registration logic
//       console.log("Processing free registration");
//       // Perhaps redirect to a confirmation page
//       // navigate(`/events/${eventId}/registered`);
//     } else {
//       // For paid events, show the payment page
//       setShowPaymentPage(true);
//     }
//   };

//   // Render user card based on user type
//   const renderUserCard = (user: User) => {
//     return (
//       <div
//         key={user.id}
//         className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow"
//       >
//         <div className="flex items-center space-x-4">
//           {user.profileImage && (
//             <img
//               src={user.profileImage}
//               alt={
//                 user.userType === USER_TYPE.INDIVIDUAL
//                   ? `${user.firstName} ${user.lastName}`
//                   : user.organizationName
//               }
//               className="h-12 w-12 rounded-full object-cover"
//             />
//           )}
//           <div>
//             {user.userType === USER_TYPE.INDIVIDUAL ? (
//               <div>
//                 <h3 className="font-medium text-gray-800 dark:text-white">
//                   {user.firstName} {user.lastName}
//                 </h3>
//                 {user.profession && (
//                   <p className="text-sm text-gray-600 dark:text-gray-300">
//                     {user.profession}
//                   </p>
//                 )}
//                 {user.affiliation && (
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     {user.affiliation}
//                   </p>
//                 )}
//               </div>
//             ) : (
//               <div>
//                 <h3 className="font-medium text-gray-800 dark:text-white">
//                   {user.organizationName}
//                 </h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   {user.organizationAddress}
//                 </p>
//               </div>
//             )}
//             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//               {user.phoneNumber}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // If payment page is shown, render it
//   if (showPaymentPage && !event.isFree) {
//     return (
//       <PaymentPage
//         eventName={event.name}
//         eventPrice={event.price || 0}
//         onCancel={() => setShowPaymentPage(false)}
//       />
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#49475B]"></div>
//       </div>
//     );
//   }

//   if (error || !event) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 py-16 text-center">
//         <PageNotFound message="Sorry, the event you are looking for does not exist." />
//       </div>
//     );
//   }

//   // Calculate remaining spots
//   const remainingSpots = event.capacity - (event.attendees?.length || 0);
//   // Calculate if event is nearly full (90% capacity)
//   const isNearlyFull = event.attendees?.length >= event.capacity * 0.9;

//   // Format event type badge
//   const getFormatBadge = () => {
//     switch (event.format) {
//       case EVENT_FORMAT.ONLINE:
//         return (
//           <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium rounded-full text-sm">
//             Online Event
//           </span>
//         );
//       case EVENT_FORMAT.PERSON:
//         return (
//           <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-medium rounded-full text-sm">
//             In-Person Event
//           </span>
//         );
//       case EVENT_FORMAT.HYBRID:
//         return (
//           <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-medium rounded-full text-sm">
//             Hybrid Event
//           </span>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 pb-16 relative z-10">
//       {/* Banner Image */}
//       {event.bannerImage && (
//         <div className="w-full h-64 md:h-80 overflow-hidden rounded-t-lg mb-6">
//           <img
//             src={event.bannerImage}
//             alt={event.name}
//             className="w-full h-full object-cover"
//           />
//         </div>
//       )}

//       {/* Main content card */}
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
//         <div className="p-6 md:p-8">
//           {/* Title and tags section */}
//           <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
//             <div>
//               <div className="flex items-center gap-2 mb-3">
//                 {getFormatBadge()}
//                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
//                   {event.name}
//                 </h1>
//               </div>
//               <div className="flex flex-wrap gap-2 mb-4">
//                 {event.tags.map((tag) => (
//                   <span
//                     key={tag}
//                     className="px-3 py-1 bg-[#49475B] bg-opacity-10 text-[#49475B] dark:text-[#b5b3c7] text-sm font-medium rounded-full"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Organized by{" "}
//                 <span className="font-medium">
//                   {event.organizers.length > 0
//                     ? event.organizers[0].userType === USER_TYPE.INDIVIDUAL
//                       ? `${event.organizers[0].firstName} ${event.organizers[0].lastName}`
//                       : event.organizers[0].organizationName
//                     : "Unknown"}
//                 </span>
//               </p>
//             </div>
//             <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
//               {event.isFree ? (
//                 <span className="px-4 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-medium rounded-full text-sm">
//                   Free Event
//                 </span>
//               ) : (
//                 <div className="text-2xl font-bold text-[#49475B] dark:text-[#b5b3c7]">
//                   ${event.price}
//                 </div>
//               )}
//               {/* Registration deadline */}
//               {event.registrationDeadline && (
//                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
//                   Registration Deadline:{" "}
//                   {formatDateTime(event.registrationDeadline)}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Three column layout for details */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Left column with description and agenda */}
//             <div className="lg:col-span-2">
//               <div className="prose dark:prose-invert max-w-none">
//                 <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//                   About This Event
//                 </h2>
//                 <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-8">
//                   {event.description}
//                 </p>

//                 <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//                   Agenda
//                 </h2>
//                 <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-8">
//                   <pre className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
//                     {event.agenda}
//                   </pre>
//                 </div>

//                 {/* Speakers Section */}
//                 <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//                   Meet the Speakers
//                 </h2>
//                 {event.speakers.length > 0 ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                     {event.speakers.map(renderUserCard)}
//                   </div>
//                 ) : (
//                   <p className="text-gray-500 dark:text-gray-400 italic mb-8">
//                     Speakers to be announced
//                   </p>
//                 )}

//                 {/* Organizers Section */}
//                 <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//                   Organized By
//                 </h2>
//                 {event.organizers.length > 0 ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                     {event.organizers.map(renderUserCard)}
//                   </div>
//                 ) : (
//                   <p className="text-gray-500 dark:text-gray-400 italic mb-8">
//                     No organizer information available
//                   </p>
//                 )}

//                 {/* Sponsors Section */}
//                 {event.sponsors.length > 0 && (
//                   <>
//                     <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//                       Sponsored By
//                     </h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                       {event.sponsors.map(renderUserCard)}
//                     </div>
//                   </>
//                 )}

//                 {/* Stakeholders Section */}
//                 {event.stakeholders.length > 0 && (
//                   <>
//                     <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//                       Stakeholders
//                     </h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {event.stakeholders.map(renderUserCard)}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Right column with event details */}
//             <div className="lg:col-span-1">
//               <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 sticky top-4">
//                 <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//                   Event Details
//                 </h2>

//                 <div className="space-y-4">
//                   {/* Date and time */}
//                   <div className="flex items-start">
//                     <div className="flex-shrink-0 mt-1">
//                       <svg
//                         className="h-5 w-5 text-[#49475B] dark:text-[#b5b3c7]"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                         />
//                       </svg>
//                     </div>
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                         Date & Time
//                       </h3>
//                       <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                         {formatDateTime(event.startDate)}
//                       </p>
//                       <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                         to {formatDateTime(event.endDate)}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Format */}
//                   <div className="flex items-start">
//                     <div className="flex-shrink-0 mt-1">
//                       <svg
//                         className="h-5 w-5 text-[#49475B] dark:text-[#b5b3c7]"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
//                         />
//                       </svg>
//                     </div>
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                         Event Format
//                       </h3>
//                       <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                         {event.format === EVENT_FORMAT.ONLINE
//                           ? "Online Event"
//                           : event.format === EVENT_FORMAT.PERSON
//                           ? "In-Person Event"
//                           : "Hybrid Event (Online & In-Person)"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Location */}
//                   {(event.format === EVENT_FORMAT.PERSON ||
//                     event.format === EVENT_FORMAT.HYBRID) &&
//                     event.address && (
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 mt-1">
//                           <svg
//                             className="h-5 w-5 text-[#49475B] dark:text-[#b5b3c7]"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                             />
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                             />
//                           </svg>
//                         </div>
//                         <div className="ml-3">
//                           <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                             Location
//                           </h3>
//                           <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                             {event.address}
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                   {/* Virtual Link */}
//                   {(event.format === EVENT_FORMAT.ONLINE ||
//                     event.format === EVENT_FORMAT.HYBRID) &&
//                     event.virtualPlatformLink && (
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 mt-1">
//                           <svg
//                             className="h-5 w-5 text-[#49475B] dark:text-[#b5b3c7]"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
//                             />
//                           </svg>
//                         </div>
//                         <div className="ml-3">
//                           <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                             Virtual Platform
//                           </h3>
//                           <a
//                             href={event.virtualPlatformLink}
//                             className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             Join Virtual Event
//                           </a>
//                           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                             (Link will be active during the event)
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                   {/* Event Admin */}
//                   <div className="flex items-start">
//                     <div className="flex-shrink-0 mt-1">
//                       <svg
//                         className="h-5 w-5 text-[#49475B] dark:text-[#b5b3c7]"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                         />
//                       </svg>
//                     </div>
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                         Event Administrator
//                       </h3>
//                       <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                         {event.eventAdmin.userType === USER_TYPE.INDIVIDUAL
//                           ? `${event.eventAdmin.firstName} ${event.eventAdmin.lastName}`
//                           : event.eventAdmin.organizationName}
//                       </p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                         {event.eventAdmin.email}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Capacity */}
//                   <div className="flex items-start">
//                     <div className="flex-shrink-0 mt-1">
//                       <svg
//                         className="h-5 w-5 text-[#49475B] dark:text-[#b5b3c7]"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                         />
//                       </svg>
//                     </div>
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                         Capacity
//                       </h3>
//                       <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                         {event.attendees.length} attending • {remainingSpots}{" "}
//                         spots left
//                       </p>
//                       <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 overflow-hidden">
//                         <div
//                           className={`h-full ${
//                             isNearlyFull ? "bg-red-500" : "bg-[#49475B]"
//                           }`}
//                           style={{
//                             width: `${
//                               (event.attendees.length / event.capacity) * 100
//                             }%`,
//                           }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Registration button */}
//                 <button
//                   onClick={registerForEvent}
//                   className="w-full mt-6 px-6 py-3 bg-[#49475B] text-white font-medium rounded-lg hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#49475B]"
//                 >
//                   {event.isFree
//                     ? "Register for Free"
//                     : `Register Now • $${event.price}`}
//                 </button>

//                 {isNearlyFull && (
//                   <p className="text-center text-sm text-red-500 dark:text-red-400 mt-2">
//                     Almost sold out! Register soon.
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventDetail;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Event, EVENT_FORMAT } from "../../lib/types/Events";
import { User, USER_TYPE } from "../../lib/types/User";
import PageNotFound from "../status/PageNotFound";
import PaymentPage from "../payment/PaymentPage";
import { useEventContext } from "../../lib/context/EventContext";

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getEventById, fetchEvents } = useEventContext();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [showPaymentPage, setShowPaymentPage] = useState(false);

  // Fetch event details based on ID
  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        setLoading(true);

        // First try to get event from router state
        if (location.state?.event) {
          setEvent(location.state.event);
          setLoading(false);
          return;
        }

        // Then try to get event from context
        const contextEvent = getEventById(eventId || "");
        if (contextEvent) {
          setEvent(contextEvent);
          setLoading(false);
          return;
        }

        // If not found in context, try to refresh events from API
        await fetchEvents();

        // Check again after refresh
        const refreshedEvent = getEventById(eventId || "");
        if (refreshedEvent) {
          setEvent(refreshedEvent);
        } else {
          setError("Event not found");
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load event details");
        setLoading(false);
        console.error(err);
      }
    };

    fetchEventDetail();
  }, [eventId, location.state, getEventById, fetchEvents]);

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
    if (!event) return;

    if (event.isFree) {
      // Handle free registration logic
      console.log("Processing free registration");
      // Perhaps redirect to a confirmation page
      // navigate(`/events/${eventId}/registered`);
    } else {
      // For paid events, show the payment page
      setShowPaymentPage(true);
    }
  };

  // Render user card based on user type
  const renderUserCard = (user: User) => {
    return (
      <div
        key={user.id}
        className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow"
      >
        <div className="flex items-center space-x-4">
          {user.profileImage && (
            <img
              src={user.profileImage}
              alt={
                user.userType === USER_TYPE.INDIVIDUAL
                  ? `${user.firstName} ${user.lastName}`
                  : user.organizationName
              }
              className="h-12 w-12 rounded-full object-cover"
            />
          )}
          <div>
            {user.userType === USER_TYPE.INDIVIDUAL ? (
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {user.firstName} {user.lastName}
                </h3>
                {user.profession && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {user.profession}
                  </p>
                )}
                {user.affiliation && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.affiliation}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {user.organizationName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.organizationAddress}
                </p>
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {user.phoneNumber}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // If payment page is shown, render it
  if (showPaymentPage && event && !event.isFree) {
    return (
      <PaymentPage
        eventName={event.name}
        eventPrice={event.price || 0}
        onCancel={() => setShowPaymentPage(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#49475B]"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <PageNotFound message="Sorry, the event you are looking for does not exist." />
      </div>
    );
  }

  // Calculate remaining spots and check if event is nearly full
  const remainingSpots = event.capacity - (event.attendees?.length || 0);

  // Calculate if event is nearly full (90% capacity)
  const isNearlyFull = (event.attendees?.length || 0) >= event.capacity * 0.9;

  // Format event type badge
  const getFormatBadge = () => {
    switch (event.format) {
      case EVENT_FORMAT.ONLINE:
        return (
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium rounded-full text-sm">
            Online Event
          </span>
        );
      case EVENT_FORMAT.PERSON:
        return (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-medium rounded-full text-sm">
            In-Person Event
          </span>
        );
      case EVENT_FORMAT.HYBRID:
        return (
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-medium rounded-full text-sm">
            Hybrid Event
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-16 relative z-10">
      {/* Banner Image */}
      {event.bannerImage && (
        <div className="w-full h-64 md:h-80 overflow-hidden rounded-t-lg mb-6">
          <img
            src={event.bannerImage}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main content card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Title and tags section */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {getFormatBadge()}
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {event.name}
                </h1>
              </div>
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
                <span className="font-medium">
                  {event.organizers.length > 0
                    ? event.organizers[0].userType === USER_TYPE.INDIVIDUAL
                      ? `${event.organizers[0].firstName} ${event.organizers[0].lastName}`
                      : event.organizers[0].organizationName
                    : "Unknown"}
                </span>
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
              {/* Registration deadline */}
              {event.registrationDeadline && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Registration Deadline:{" "}
                  {formatDateTime(event.registrationDeadline)}
                </p>
              )}
            </div>
          </div>

          {/* Three column layout for details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column with description and agenda */}
            <div className="lg:col-span-2">
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  About This Event
                </h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-8">
                  {event.description}
                </p>

                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Agenda
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-8">
                  <pre className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {event.agenda}
                  </pre>
                </div>

                {/* Speakers Section */}
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Meet the Speakers
                </h2>
                {event.speakers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {event.speakers.map(renderUserCard)}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic mb-8">
                    Speakers to be announced
                  </p>
                )}

                {/* Organizers Section */}
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Organized By
                </h2>
                {event.organizers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {event.organizers.map(renderUserCard)}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic mb-8">
                    No organizer information available
                  </p>
                )}

                {/* Sponsors Section */}
                {event.sponsors.length > 0 && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                      Sponsored By
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {event.sponsors.map(renderUserCard)}
                    </div>
                  </>
                )}

                {/* Stakeholders Section */}
                {event.stakeholders.length > 0 && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                      Stakeholders
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.stakeholders.map(renderUserCard)}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right column with event details */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 sticky top-4">
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
                        {formatDateTime(event.startDate)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        to {formatDateTime(event.endDate)}
                      </p>
                    </div>
                  </div>

                  {/* Format */}
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
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Event Format
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {event.format === EVENT_FORMAT.ONLINE
                          ? "Online Event"
                          : event.format === EVENT_FORMAT.PERSON
                          ? "In-Person Event"
                          : "Hybrid Event (Online & In-Person)"}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  {(event.format === EVENT_FORMAT.PERSON ||
                    event.format === EVENT_FORMAT.HYBRID) &&
                    event.address && (
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
                            {event.address}
                          </p>
                        </div>
                      </div>
                    )}

                  {/* Virtual Link */}
                  {(event.format === EVENT_FORMAT.ONLINE ||
                    event.format === EVENT_FORMAT.HYBRID) &&
                    event.virtualPlatformLink && (
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
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Virtual Platform
                          </h3>
                          <a
                            href={event.virtualPlatformLink}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Join Virtual Event
                          </a>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            (Link will be active during the event)
                          </p>
                        </div>
                      </div>
                    )}

                  {/* Event Admin */}
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Event Administrator
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {event.eventAdmin.userType === USER_TYPE.INDIVIDUAL
                          ? `${event.eventAdmin.firstName} ${event.eventAdmin.lastName}`
                          : event.eventAdmin.organizationName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {event.eventAdmin.email}
                      </p>
                    </div>
                  </div>

                  {/* Capacity */}
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
                        {event.attendees.length} attending • {remainingSpots}{" "}
                        spots left
                      </p>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full ${
                            isNearlyFull ? "bg-red-500" : "bg-[#49475B]"
                          }`}
                          style={{
                            width: `${
                              (event.attendees.length / event.capacity) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration button */}
                <button
                  onClick={registerForEvent}
                  className="w-full mt-6 px-6 py-3 bg-[#49475B] text-white font-medium rounded-lg hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#49475B]"
                >
                  {event.isFree
                    ? "Register for Free"
                    : `Register Now • $${event.price}`}
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
