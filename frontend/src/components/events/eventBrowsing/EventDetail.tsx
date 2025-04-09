// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { Event, EVENT_FORMAT } from "../../../lib/types/Events";
// import { User } from "../../../lib/types/User";
// import { USER_ROLE } from "../../../lib/types/Ticket";
// import PageNotFound from "../../status/PageNotFound";
// import PaymentPage from "../../payment/PaymentPage";
// import PaymentSuccess from "../../payment/PaymentSuccess";
// import { useEventContext } from "../../../lib/context/EventContext";
// import { useTickets } from "../../../lib/context/TicketContext";
// import { PencilIcon } from "@heroicons/react/20/solid";
// import { Instagram, Facebook, Linkedin } from "lucide-react";
// import { useAuth } from "../../../lib/hooks/useAuth";
// import { UserGroupIcon } from "@heroicons/react/20/solid";
// import ManageAttendeesModal from "./attendeeManagement/AttendeeManagement";
// import {
//   removeUsersFromEvent,
//   deleteAttendeeTicket,
// } from "../../../lib/services/eventService";

// const EventDetail: React.FC = () => {
//   const { eventId } = useParams<{ eventId: string }>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { getEventById, fetchEvents } = useEventContext();
//   const { createTicket, userTickets } = useTickets();
//   const { user } = useAuth();

//   const [event, setEvent] = useState<Event | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState("");
//   const [showPaymentPage, setShowPaymentPage] = useState(false);
//   const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
//   const [registrationLoading, setRegistrationLoading] = useState(false);
//   const [registrationError, setRegistrationError] = useState("");
//   const [isUserRegistered, setIsUserRegistered] = useState(false);
//   const [showManageAttendeesModal, setShowManageAttendeesModal] =
//     useState<boolean>(false);
//   const [isEventPast, setIsEventPast] = useState(false);

//   const API_BASE_URL = "http://localhost:8000";

//   // Check if current user is the admin of this event
//   const isEventAdmin =
//     event && user && String(event.eventAdmin.id) === String(user.id);

//   // Handle edit button click
//   const handleEditClick = () => {
//     if (event != null) navigate(`/createevent/${event.id}`);
//   };

//   // Handle manage attendees button click
//   const handleManageAttendeesClick = () => {
//     setShowManageAttendeesModal(true);
//   };

//   // Handle removing users from event
//   const handleRemoveUsers = async (
//     userIds: string[],
//     role: USER_ROLE
//   ): Promise<boolean> => {
//     if (!event) return false;

//     if (role !== USER_ROLE.ATTENDEE) {
//       console.error(
//         "Only attendee removal is supported in this implementation."
//       );
//       return false;
//     }

//     try {
//       // Remove the attendee ticket for each selected user
//       await Promise.all(
//         userIds.map(async (userId) => {
//           await deleteAttendeeTicket(event.id.toString(), userId);
//         })
//       );

//       // Update the local event state to remove the deleted attendees
//       const updatedAttendees = (event.attendees || []).filter(
//         (attendee) => !userIds.includes(attendee.id)
//       );
//       // Update the event state so the modal gets the refreshed list
//       setEvent({ ...event, attendees: updatedAttendees });

//       return true;
//     } catch (error) {
//       console.error("Error removing attendee tickets:", error);
//       throw error;
//     }
//   };

//   // Check if user is already registered for this event using TicketContext
//   useEffect(() => {
//     if (user && event && userTickets.length > 0) {
//       // Check if the user has a ticket for this event
//       const hasTicket = userTickets.some(
//         (ticket) => String(ticket.eventId) === String(event.id)
//       );

//       console.log("user already registered to this", hasTicket);

//       setIsUserRegistered(hasTicket);
//       console.log(
//         "User registration status:",
//         hasTicket ? "Registered" : "Not registered"
//       );
//     }
//   }, [user, event?.id, userTickets]);

//   // Fetch event details based on ID
//   useEffect(() => {
//     const fetchEventDetail = async () => {
//       try {
//         setLoading(true);

//         // First try to get event from router state
//         if (location.state?.event) {
//           setEvent(location.state.event);
//           setLoading(false);
//           return;
//         }

//         // Then try to get event from context
//         const contextEvent = getEventById(eventId || "");
//         if (contextEvent) {
//           setEvent(contextEvent);
//           setLoading(false);
//           return;
//         }

//         // If not found in context, try to refresh events from API
//         await fetchEvents();

//         // Check again after refresh
//         const refreshedEvent = getEventById(eventId || "");
//         if (refreshedEvent) {
//           setEvent(refreshedEvent);
//         } else {
//           setError("Event not found");
//         }

//         setLoading(false);

//         if (user && eventId && userTickets.length > 0) {
//           // Check if the user has a ticket for this event
//           const hasTicket = userTickets.some(
//             (ticket) => String(ticket.eventId) === String(eventId)
//           );

//           console.log("user already registered to this", hasTicket);

//           setIsUserRegistered(hasTicket);
//           console.log(
//             "User registration status:",
//             hasTicket ? "Registered" : "Not registered"
//           );
//         }
//       } catch (err) {
//         setError("Failed to load event details");
//         setLoading(false);
//         console.error(err);
//       }
//     };

//     fetchEventDetail();
//   }, [eventId, location.state, getEventById, fetchEvents]);

//   useEffect(() => {
//     if (event) {
//       const currentDate = new Date();
//       setIsEventPast(event.endDate < currentDate);
//     }
//   }, [event]);

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

//   // Process ticket creation
//   const processTicketCreation = async () => {
//     if (!event || !user) return;

//     try {
//       setRegistrationLoading(true);
//       setRegistrationError("");

//       // Create a new ticket for this user and event
//       const newTicket = {
//         userId: user.id,
//         eventId: event.id,
//         role: USER_ROLE.ATTENDEE,
//         registrationDate: new Date(),
//       };

//       const createdTicket = await createTicket(newTicket);
//       console.log("Ticket created successfully:", createdTicket);

//       // Update registration status
//       setIsUserRegistered(true);
//       setShowPaymentSuccess(true);
//     } catch (err: any) {
//       console.error("Error creating ticket:", err);
//       setRegistrationError(
//         err.message || "Failed to register for this event. Please try again."
//       );
//     } finally {
//       setRegistrationLoading(false);
//     }
//   };

//   // Handle initial registration button click
//   const registerForEvent = async () => {
//     if (!event) return;
//     if (!user) {
//       // Redirect to login if user is not authenticated
//       navigate("/signin", { state: { redirect: `/det/${eventId}` } });
//       return;
//     }

//     // Don't proceed if already registered
//     if (isUserRegistered) {
//       return;
//     }

//     try {
//       if (event.isFree) {
//         // For free events, create the ticket immediately
//         await processTicketCreation();
//       } else {
//         // For paid events, show the payment page first
//         console.log("Showing payment page for paid event");
//         setShowPaymentPage(true);
//       }
//     } catch (err: any) {
//       console.error("Error during registration process:", err);
//       setRegistrationError(
//         err.message || "Failed to register for this event. Please try again."
//       );
//     }
//   };

//   // Handle successful payment (for paid events)
//   const handlePaymentSuccess = async () => {
//     // Only create the ticket after successful payment
//     try {
//       await processTicketCreation();
//       setShowPaymentPage(false);
//     } catch (err: any) {
//       console.error("Error after payment:", err);
//       setRegistrationError(
//         err.message ||
//           "Payment was successful, but we couldn't complete registration. Please contact support."
//       );
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
//                 user.userType === "individual"
//                   ? `${user.firstName} ${user.lastName}`
//                   : user.organizationName
//               }
//               className="h-12 w-12 rounded-full object-cover"
//             />
//           )}
//           <div>
//             {user.userType === "individual" ? (
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
//   if (showPaymentPage && event && !event.isFree) {
//     return (
//       <PaymentPage
//         eventName={event.name}
//         eventPrice={event.price || 0}
//         onCancel={() => setShowPaymentPage(false)}
//         onSuccess={handlePaymentSuccess}
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

//   // Calculate remaining spots and check if event is nearly full
//   const remainingSpots = event.capacity - (event.attendees?.length || 0);

//   // Calculate if event is nearly full (90% capacity)
//   const isNearlyFull = (event.attendees?.length || 0) >= event.capacity * 0.9;

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

//   // Render the appropriate registration button based on user registration status
//   const renderRegistrationButton = () => {
//     if (isEventPast) {
//       return (
//         <div className="w-full mt-6 px-6 py-3 bg-gray-400 text-white font-medium rounded-lg text-center cursor-not-allowed">
//           Event Has Ended
//         </div>
//       );
//     }

//     if (isUserRegistered) {
//       return (
//         <div className="w-full mt-6 px-6 py-3 bg-green-500 text-white font-medium rounded-lg text-center">
//           You're Registered ✓
//         </div>
//       );
//     } else if (remainingSpots <= 0) {
//       return (
//         <div className="w-full mt-6 px-6 py-3 bg-gray-400 text-white font-medium rounded-lg text-center cursor-not-allowed">
//           Event Full
//         </div>
//       );
//     } else {
//       return (
//         <button
//           onClick={registerForEvent}
//           disabled={registrationLoading || isEventPast}
//           className={`w-full mt-6 px-6 py-3 ${
//             registrationLoading || isEventPast
//               ? "bg-gray-400"
//               : "bg-[#49475B] hover:bg-gray-500"
//           } text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#49475B]`}
//         >
//           {isEventPast ? (
//             "Event Ended"
//           ) : registrationLoading ? (
//             <span className="flex items-center justify-center">
//               <svg
//                 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//               Processing...
//             </span>
//           ) : event.isFree ? (
//             "Register for Free"
//           ) : (
//             `Register Now • $${event.price}`
//           )}
//         </button>
//       );
//     }
//   };

//   return (
//     <>
//       <div className="max-w-6xl mx-auto mt-30 px-4 pb-16 relative z-10">
//         {/* Manage Attendees Modal */}
//         {event && (
//           <ManageAttendeesModal
//             isOpen={showManageAttendeesModal}
//             onClose={() => setShowManageAttendeesModal(false)}
//             eventId={event.id}
//             attendees={event.attendees || []}
//             sponsors={event.sponsors || []}
//             onRemoveUsers={handleRemoveUsers}
//           />
//         )}
//         {/* Admin Action Bar - Only shown to event admins */}
//         {isEventAdmin && (
//           <div className="bg-gray-200 p-4 mb-6 rounded-md flex justify-end items-center space-x-4">
//             <button
//               onClick={handleManageAttendeesClick}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//             >
//               <UserGroupIcon className="h-5 w-5 mr-2" />
//               Manage Attendees
//             </button>
//             <button
//               onClick={handleEditClick}
//               className="flex items-center px-4 py-2 bg-[#655967] text-white rounded-md hover:bg-gray-700 transition-colors"
//             >
//               <PencilIcon className="h-5 w-5 mr-2" />
//               Edit Event
//             </button>
//           </div>
//         )}

//         {/* Banner Image */}
//         {event.bannerImage && (
//           <div className="w-full h-64 md:h-80 overflow-hidden rounded-t-lg mb-6">
//             <img
//               src={event.bannerImage}
//               alt={event.name}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         )}

//         {/* Main content card */}
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
//           <div className="p-6 md:p-8">
//             {/* Title and tags section */}
//             <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
//               <div>
//                 <div className="flex items-center gap-2 mb-3">
//                   {getFormatBadge()}
//                   <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
//                     {event.name}
//                   </h1>
//                 </div>
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {event.tags.map((tag) => (
//                     <span
//                       key={tag}
//                       className="px-3 py-1 bg-[#49475B] bg-opacity-10 text-[#49475B] dark:text-[#b5b3c7] text-sm font-medium rounded-full"
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Organized by{" "}
//                   <span className="font-medium">
//                     {event.organizers.length > 0
//                       ? event.organizers[0].userType === "individual"
//                         ? `${event.organizers[0].firstName} ${event.organizers[0].lastName}`
//                         : event.organizers[0].organizationName
//                       : "Unknown"}
//                   </span>
//                 </p>
//               </div>
//               <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
//                 {event.isFree ? (
//                   <span className="px-4 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-medium rounded-full text-sm">
//                     Free Event
//                   </span>
//                 ) : (
//                   <div className="text-2xl font-bold text-[#49475B] dark:text-[#b5b3c7]">
//                     ${event.price}
//                   </div>
//                 )}
//                 {/* Registration deadline */}
//                 {event.registrationDeadline && (
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
//                     Registration Deadline:{" "}
//                     {formatDateTime(event.registrationDeadline)}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Three column layout for details */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Left column with description and agenda */}
//               <div className="lg:col-span-2">
//                 <div className="prose dark:prose-invert max-w-none">
//                   <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//                     About This Event
//                   </h2>
//                   <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-8">
//                     {event.description}
//                   </p>

//                   <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//                     Agenda
//                   </h2>
//                   <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-8">
//                     <pre className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
//                       {event.agenda}
//                     </pre>
//                   </div>

//                   <div className="w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden mt-4 mb-8">
//                     <div className="max-w-3xl mx-auto px-3 py-3">
//                       <div className="flex flex-col items-left space-y-3">
//                         <h3 className="text-lg font-bold text-gray-800 dark:text-white">
//                           Resources
//                         </h3>

//                         <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full mt-1">
//                           {/* Document 1 */}
//                           <div className="flex flex-col items-center">
//                             <a
//                               href="https://google.com/"
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="bg-gray-50 dark:bg-gray-600 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors flex items-center justify-center w-20 h-20"
//                             >
//                               <svg
//                                 className="h-12 w-12 text-red-600"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 viewBox="0 0 24 24"
//                                 fill="currentColor"
//                               >
//                                 <path d="M23 0H9v5h5v4H0v15h14v-5h-5v-4h14V0zM5.7 17.1c-.1.1-.2.1-.3.2-.2.1-.4.1-.5.1-.3 0-.5-.1-.7-.2-.2-.1-.3-.3-.3-.5 0-.1 0-.2.1-.3 0-.1.1-.2.2-.2.1-.1.2-.1.3-.2.1 0 .2-.1.4-.1h.4c.1 0 .2 0 .4.1v.1c0 .1 0 .2.1.3 0 .1 0 .2-.1.3 0 .1 0 .2-.1.3-.1.1-.2.1-.3.2-.1-.1-.2-.1-.3-.1s-.2 0-.3.1zm3.2-2.3c-.1.1-.2.3-.3.4l-.1.1c-.2.3-.5.5-.8.7-.3.2-.7.2-1 .2-.3 0-.6-.1-.8-.2-.2-.1-.4-.3-.5-.5-.1-.2-.2-.4-.3-.7 0-.2-.1-.5-.1-.7 0-.5.1-.9.3-1.3.2-.4.5-.7.9-.9.3-.2.7-.3 1.1-.3.2 0 .5 0 .7.1.2.1.3.2.4.3.1.1.2.3.2.4 0 .2.1.3.1.5v.3c0 .2-.1.4-.1.5-.1.3-.3.5-.4.7-.2.2-.5.3-.8.3h-.2c-.1 0-.1-.1-.2-.1-.1-.1-.1-.1-.1-.2 0-.2.1-.3.2-.5.1-.1.2-.3.3-.4.1-.1.2-.3.2-.4.1-.1.1-.3.1-.3v-.1c0-.1 0-.1-.1-.2h-.1c-.2 0-.3.1-.5.2-.1.2-.3.3-.4.5-.1.2-.2.4-.2.7-.1.2-.1.5-.1.7 0 .5.1.8.2 1 .1.2.3.3.5.3.2 0 .4-.1.5-.2.2-.1.3-.3.5-.6.1-.2.2-.3.2-.5.1-.2.1-.3.2-.5v-.2c0-.1 0-.1.1-.1h.2c.2 0 .3.1.3.2.1.1.1.3.1.4 0 .1 0 .3-.1.4 0 .2-.1.3-.2.5zm-.8-5.3c0-.2.1-.3.2-.4s.2-.1.4-.1c.1 0 .2 0 .3.1.1.1.1.2.1.3 0 .1 0 .2-.1.3-.1.1-.2.1-.3.1-.1 0-.2 0-.3-.1-.1-.1-.2-.2-.3-.2zm4.4 6.5c0 .2-.1.4-.3.5-.2.1-.4.2-.7.2-.1 0-.3 0-.5-.1-.1-.1-.2-.1-.3-.2-.1-.1-.2-.2-.2-.3-.1-.1-.1-.3-.1-.4 0-.2 0-.4.1-.5.1-.1.1-.3.2-.4.1-.1.2-.2.4-.2.1-.1.3-.1.4-.1h.1c.1 0 .2 0 .3.1.1 0 .2.1.2.2.1.1.1.1.1.2 0 .1.1.1.1.2v.3c.1 0 .1.1.1.2 0 .1.1.2.1.3zm5.7-10.3c-.2.2-.4.6-.6.9-.2.3-.4.7-.6 1.1-.3.4-.5.8-.8 1.2-.5.8-1 1.6-1.4 2.4-.1.1-.1.2-.1.3-.2.4-.4.9-.6 1.3l-.3.6c-.1.3-.3.7-.4 1 0 .1-.1.2-.1.2-.1.3-.2.5-.2.8-.1.4-.1.7-.1 1.1 0 .2 0 .5.1.7.1.2.2.3.4.3h.1c.2 0 .4-.1.7-.3.2-.2.4-.4.6-.7.2-.3.3-.5.5-.8.1-.3.3-.6.4-.9.1-.3.2-.5.2-.8.1-.3.1-.5.2-.7 0-.1.1-.1.1-.1.1 0 .1 0 .2.1v.1c0 .3-.1.7-.2 1s-.2.6-.4 1c-.2.3-.3.6-.5.9-.2.3-.4.6-.6.8-.2.2-.5.4-.7.6-.3.1-.5.2-.8.2-.3 0-.5-.1-.7-.2-.2-.1-.3-.3-.4-.5-.1-.2-.2-.4-.2-.6-.1-.2-.1-.5-.1-.7 0-.5.1-1 .2-1.5.1-.5.4-1 .6-1.5.3-.5.6-1 .9-1.5.3-.5.6-1 1-1.5.3-.5.6-.9.9-1.3.3-.4.6-.8.8-1.1.1-.1.1-.2.2-.3H13v-.1c0-.1-.1-.2-.2-.3H6v-.8c.1 0 .1-.1.2-.1h7.8c.1 0 .2 0 .3.1.1.1.2.1.2.2.1.1.1.2.1.3 0 .1 0 .2-.1.3 0 .4-.2.6-.2.8z" />
//                               </svg>
//                             </a>
//                             <span className="text-xs font-medium text-gray-700 dark:text-gray-200 mt-1">
//                               Syllabus
//                             </span>
//                           </div>

//                           {/* Document 2 */}
//                           <div className="flex flex-col items-center">
//                             <a
//                               href="https://google.com/"
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="bg-gray-50 dark:bg-gray-600 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors flex items-center justify-center w-20 h-20"
//                             >
//                               <svg
//                                 className="h-12 w-12 text-red-600"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 viewBox="0 0 24 24"
//                                 fill="currentColor"
//                               >
//                                 <path d="M23 0H9v5h5v4H0v15h14v-5h-5v-4h14V0zM5.7 17.1c-.1.1-.2.1-.3.2-.2.1-.4.1-.5.1-.3 0-.5-.1-.7-.2-.2-.1-.3-.3-.3-.5 0-.1 0-.2.1-.3 0-.1.1-.2.2-.2.1-.1.2-.1.3-.2.1 0 .2-.1.4-.1h.4c.1 0 .2 0 .4.1v.1c0 .1 0 .2.1.3 0 .1 0 .2-.1.3 0 .1 0 .2-.1.3-.1.1-.2.1-.3.2-.1-.1-.2-.1-.3-.1s-.2 0-.3.1zm3.2-2.3c-.1.1-.2.3-.3.4l-.1.1c-.2.3-.5.5-.8.7-.3.2-.7.2-1 .2-.3 0-.6-.1-.8-.2-.2-.1-.4-.3-.5-.5-.1-.2-.2-.4-.3-.7 0-.2-.1-.5-.1-.7 0-.5.1-.9.3-1.3.2-.4.5-.7.9-.9.3-.2.7-.3 1.1-.3.2 0 .5 0 .7.1.2.1.3.2.4.3.1.1.2.3.2.4 0 .2.1.3.1.5v.3c0 .2-.1.4-.1.5-.1.3-.3.5-.4.7-.2.2-.5.3-.8.3h-.2c-.1 0-.1-.1-.2-.1-.1-.1-.1-.1-.1-.2 0-.2.1-.3.2-.5.1-.1.2-.3.3-.4.1-.1.2-.3.2-.4.1-.1.1-.3.1-.3v-.1c0-.1 0-.1-.1-.2h-.1c-.2 0-.3.1-.5.2-.1.2-.3.3-.4.5-.1.2-.2.4-.2.7-.1.2-.1.5-.1.7 0 .5.1.8.2 1 .1.2.3.3.5.3.2 0 .4-.1.5-.2.2-.1.3-.3.5-.6.1-.2.2-.3.2-.5.1-.2.1-.3.2-.5v-.2c0-.1 0-.1.1-.1h.2c.2 0 .3.1.3.2.1.1.1.3.1.4 0 .1 0 .3-.1.4 0 .2-.1.3-.2.5zm-.8-5.3c0-.2.1-.3.2-.4s.2-.1.4-.1c.1 0 .2 0 .3.1.1.1.1.2.1.3 0 .1 0 .2-.1.3-.1.1-.2.1-.3.1-.1 0-.2 0-.3-.1-.1-.1-.2-.2-.3-.2zm4.4 6.5c0 .2-.1.4-.3.5-.2.1-.4.2-.7.2-.1 0-.3 0-.5-.1-.1-.1-.2-.1-.3-.2-.1-.1-.2-.2-.2-.3-.1-.1-.1-.3-.1-.4 0-.2 0-.4.1-.5.1-.1.1-.3.2-.4.1-.1.2-.2.4-.2.1-.1.3-.1.4-.1h.1c.1 0 .2 0 .3.1.1 0 .2.1.2.2.1.1.1.1.1.2 0 .1.1.1.1.2v.3c.1 0 .1.1.1.2 0 .1.1.2.1.3zm5.7-10.3c-.2.2-.4.6-.6.9-.2.3-.4.7-.6 1.1-.3.4-.5.8-.8 1.2-.5.8-1 1.6-1.4 2.4-.1.1-.1.2-.1.3-.2.4-.4.9-.6 1.3l-.3.6c-.1.3-.3.7-.4 1 0 .1-.1.2-.1.2-.1.3-.2.5-.2.8-.1.4-.1.7-.1 1.1 0 .2 0 .5.1.7.1.2.2.3.4.3h.1c.2 0 .4-.1.7-.3.2-.2.4-.4.6-.7.2-.3.3-.5.5-.8.1-.3.3-.6.4-.9.1-.3.2-.5.2-.8.1-.3.1-.5.2-.7 0-.1.1-.1.1-.1.1 0 .1 0 .2.1v.1c0 .3-.1.7-.2 1s-.2.6-.4 1c-.2.3-.3.6-.5.9-.2.3-.4.6-.6.8-.2.2-.5.4-.7.6-.3.1-.5.2-.8.2-.3 0-.5-.1-.7-.2-.2-.1-.3-.3-.4-.5-.1-.2-.2-.4-.2-.6-.1-.2-.1-.5-.1-.7 0-.5.1-1 .2-1.5.1-.5.4-1 .6-1.5.3-.5.6-1 .9-1.5.3-.5.6-1 1-1.5.3-.5.6-.9.9-1.3.3-.4.6-.8.8-1.1.1-.1.1-.2.2-.3H13v-.1c0-.1-.1-.2-.2-.3H6v-.8c.1 0 .1-.1.2-.1h7.8c.1 0 .2 0 .3.1.1.1.2.1.2.2.1.1.1.2.1.3 0 .1 0 .2-.1.3 0 .4-.2.6-.2.8z" />
//                               </svg>
//                             </a>
//                             <span className="text-xs font-medium text-gray-700 dark:text-gray-200 mt-1">
//                               Set Yourself Up
//                             </span>
//                           </div>
//                           {/* Document 3 */}
//                           <div className="flex flex-col items-center">
//                             <a
//                               href="https://google.com/"
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="bg-gray-50 dark:bg-gray-600 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors flex items-center justify-center w-20 h-20"
//                             >
//                               <svg
//                                 className="h-12 w-12 text-red-600"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 viewBox="0 0 24 24"
//                                 fill="currentColor"
//                               >
//                                 <path d="M23 0H9v5h5v4H0v15h14v-5h-5v-4h14V0zM5.7 17.1c-.1.1-.2.1-.3.2-.2.1-.4.1-.5.1-.3 0-.5-.1-.7-.2-.2-.1-.3-.3-.3-.5 0-.1 0-.2.1-.3 0-.1.1-.2.2-.2.1-.1.2-.1.3-.2.1 0 .2-.1.4-.1h.4c.1 0 .2 0 .4.1v.1c0 .1 0 .2.1.3 0 .1 0 .2-.1.3 0 .1 0 .2-.1.3-.1.1-.2.1-.3.2-.1-.1-.2-.1-.3-.1s-.2 0-.3.1zm3.2-2.3c-.1.1-.2.3-.3.4l-.1.1c-.2.3-.5.5-.8.7-.3.2-.7.2-1 .2-.3 0-.6-.1-.8-.2-.2-.1-.4-.3-.5-.5-.1-.2-.2-.4-.3-.7 0-.2-.1-.5-.1-.7 0-.5.1-.9.3-1.3.2-.4.5-.7.9-.9.3-.2.7-.3 1.1-.3.2 0 .5 0 .7.1.2.1.3.2.4.3.1.1.2.3.2.4 0 .2.1.3.1.5v.3c0 .2-.1.4-.1.5-.1.3-.3.5-.4.7-.2.2-.5.3-.8.3h-.2c-.1 0-.1-.1-.2-.1-.1-.1-.1-.1-.1-.2 0-.2.1-.3.2-.5.1-.1.2-.3.3-.4.1-.1.2-.3.2-.4.1-.1.1-.3.1-.3v-.1c0-.1 0-.1-.1-.2h-.1c-.2 0-.3.1-.5.2-.1.2-.3.3-.4.5-.1.2-.2.4-.2.7-.1.2-.1.5-.1.7 0 .5.1.8.2 1 .1.2.3.3.5.3.2 0 .4-.1.5-.2.2-.1.3-.3.5-.6.1-.2.2-.3.2-.5.1-.2.1-.3.2-.5v-.2c0-.1 0-.1.1-.1h.2c.2 0 .3.1.3.2.1.1.1.3.1.4 0 .1 0 .3-.1.4 0 .2-.1.3-.2.5zm-.8-5.3c0-.2.1-.3.2-.4s.2-.1.4-.1c.1 0 .2 0 .3.1.1.1.1.2.1.3 0 .1 0 .2-.1.3-.1.1-.2.1-.3.1-.1 0-.2 0-.3-.1-.1-.1-.2-.2-.3-.2zm4.4 6.5c0 .2-.1.4-.3.5-.2.1-.4.2-.7.2-.1 0-.3 0-.5-.1-.1-.1-.2-.1-.3-.2-.1-.1-.2-.2-.2-.3-.1-.1-.1-.3-.1-.4 0-.2 0-.4.1-.5.1-.1.1-.3.2-.4.1-.1.2-.2.4-.2.1-.1.3-.1.4-.1h.1c.1 0 .2 0 .3.1.1 0 .2.1.2.2.1.1.1.1.1.2 0 .1.1.1.1.2v.3c.1 0 .1.1.1.2 0 .1.1.2.1.3zm5.7-10.3c-.2.2-.4.6-.6.9-.2.3-.4.7-.6 1.1-.3.4-.5.8-.8 1.2-.5.8-1 1.6-1.4 2.4-.1.1-.1.2-.1.3-.2.4-.4.9-.6 1.3l-.3.6c-.1.3-.3.7-.4 1 0 .1-.1.2-.1.2-.1.3-.2.5-.2.8-.1.4-.1.7-.1 1.1 0 .2 0 .5.1.7.1.2.2.3.4.3h.1c.2 0 .4-.1.7-.3.2-.2.4-.4.6-.7.2-.3.3-.5.5-.8.1-.3.3-.6.4-.9.1-.3.2-.5.2-.8.1-.3.1-.5.2-.7 0-.1.1-.1.1-.1.1 0 .1 0 .2.1v.1c0 .3-.1.7-.2 1s-.2.6-.4 1c-.2.3-.3.6-.5.9-.2.3-.4.6-.6.8-.2.2-.5.4-.7.6-.3.1-.5.2-.8.2-.3 0-.5-.1-.7-.2-.2-.1-.3-.3-.4-.5-.1-.2-.2-.4-.2-.6-.1-.2-.1-.5-.1-.7 0-.5.1-1 .2-1.5.1-.5.4-1 .6-1.5.3-.5.6-1 .9-1.5.3-.5.6-1 1-1.5.3-.5.6-.9.9-1.3.3-.4.6-.8.8-1.1.1-.1.1-.2.2-.3H13v-.1c0-.1-.1-.2-.2-.3H6v-.8c.1 0 .1-.1.2-.1h7.8c.1 0 .2 0 .3.1.1.1.2.1.2.2.1.1.1.2.1.3 0 .1 0 .2-.1.3 0 .4-.2.6-.2.8z" />
//                               </svg>
//                             </a>
//                             <span className="text-xs font-medium text-gray-700 dark:text-gray-200 mt-1">
//                               Event Slides
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   {/* Speakers Section */}
//                   <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//                     Meet the Speakers
//                   </h2>
//                   {event.speakers.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                       {event.speakers.map(renderUserCard)}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 dark:text-gray-400 italic mb-8">
//                       Speakers to be announced
//                     </p>
//                   )}

//                   {/* Organizers Section */}
//                   <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//                     Organized By
//                   </h2>
//                   {event.organizers.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                       {event.organizers.map(renderUserCard)}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 dark:text-gray-400 italic mb-8">
//                       No organizer information available
//                     </p>
//                   )}

//                   {/* Sponsors Section */}
//                   {event.sponsors.length > 0 && (
//                     <>
//                       <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//                         Sponsored By
//                       </h2>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                         {event.sponsors.map(renderUserCard)}
//                       </div>
//                     </>
//                   )}

//                   {/* Stakeholders Section */}
//                   {event.stakeholders.length > 0 && (
//                     <>
//                       <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//                         Stakeholders
//                       </h2>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {event.stakeholders.map(renderUserCard)}
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>

//               {/* Right column with event details */}
//               <div className="lg:col-span-1">
//                 <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 sticky top-4">
//                   <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//                     Event Details
//                   </h2>

//                   <div className="space-y-4">
//                     {/* Date and time */}
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 mt-1">
//                         <svg
//                           className="h-5 w-5 text-[#49475B] dark:text-[#b5b3c7]"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                           />
//                         </svg>
//                       </div>
//                       <div className="ml-3">
//                         <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                           Date & Time
//                         </h3>
//                         <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                           {formatDateTime(event.startDate)}
//                         </p>
//                         <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                           to {formatDateTime(event.endDate)}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Format */}
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 mt-1">
//                         <svg
//                           className="h-5 w-5 text-[#49475B] dark:text-[#b5b3c7]"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
//                           />
//                         </svg>
//                       </div>
//                       <div className="ml-3">
//                         <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                           Event Format
//                         </h3>
//                         <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                           {event.format === EVENT_FORMAT.ONLINE
//                             ? "Online Event"
//                             : event.format === EVENT_FORMAT.PERSON
//                             ? "In-Person Event"
//                             : "Hybrid Event (Online & In-Person)"}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Location */}
//                     {(event.format === EVENT_FORMAT.PERSON ||
//                       event.format === EVENT_FORMAT.HYBRID) &&
//                       event.address && (
//                         <div className="flex items-start">
//                           <div className="flex-shrink-0 mt-1">
//                             <svg
//                               className="h-5 w-5 text-[#49475B] dark:text-[#b5b3c7]"
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                               stroke="currentColor"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                               />
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                               />
//                             </svg>
//                           </div>
//                           <div className="ml-3">
//                             <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                               Location
//                             </h3>
//                             <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                               {event.address}
//                             </p>
//                           </div>
//                         </div>
//                       )}

//                     {/* Virtual Link */}
//                     {(event.format === EVENT_FORMAT.ONLINE ||
//                       event.format === EVENT_FORMAT.HYBRID) &&
//                       event.virtualPlatformLink && (
//                         <div className="flex items-start">
//                           <div className="flex-shrink-0 mt-1">
//                             <svg
//                               className="h-5 w-5 text-[#49475B] dark:text-[#b5b3c7]"
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                               stroke="currentColor"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
//                               />
//                             </svg>
//                           </div>
//                           <div className="ml-3">
//                             <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                               Virtual Platform
//                             </h3>
//                             <a
//                               href={event.virtualPlatformLink}
//                               className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               Join Virtual Event
//                             </a>
//                             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                               (Link will be active during the event)
//                             </p>
//                           </div>
//                         </div>
//                       )}

//                     {/* Event Admin */}
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 mt-1">
//                         <svg
//                           className="h-5 w-5 text-[#49475B] dark:text-[#b5b3c7]"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                           />
//                         </svg>
//                       </div>
//                       <div className="ml-3">
//                         <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                           Event Administrator
//                         </h3>
//                         <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                           {event.eventAdmin.userType === "individual"
//                             ? `${event.eventAdmin.firstName} ${event.eventAdmin.lastName}`
//                             : event.eventAdmin.organizationName}
//                         </p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                           {event.eventAdmin.email}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Capacity */}
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 mt-1">
//                         <svg
//                           className="h-5 w-5 text-[#49475B] dark:text-[#b5b3c7]"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                           />
//                         </svg>
//                       </div>
//                       <div className="ml-3">
//                         <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                           Capacity
//                         </h3>
//                         <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                           {event.attendees.length} attending • {remainingSpots}{" "}
//                           spots left
//                         </p>
//                         <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 overflow-hidden">
//                           <div
//                             className={`h-full ${
//                               isNearlyFull ? "bg-red-500" : "bg-[#49475B]"
//                             }`}
//                             style={{
//                               width: `${
//                                 (event.attendees.length / event.capacity) * 100
//                               }%`,
//                             }}
//                           ></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Registration error message */}
//                   {registrationError && (
//                     <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
//                       {registrationError}
//                     </div>
//                   )}

//                   {/* Registration button - using the render function */}
//                   {renderRegistrationButton()}

//                   {/* Render PaymentSuccess for events */}
//                   {showPaymentSuccess && (
//                     <PaymentSuccess
//                       eventName={event.name}
//                       isVisible={showPaymentSuccess}
//                       onClose={() => setShowPaymentSuccess(false)}
//                     />
//                   )}

//                   {isNearlyFull && !isUserRegistered && remainingSpots > 0 && (
//                     <p className="text-center text-sm text-red-500 dark:text-red-400 mt-2">
//                       Almost sold out! Register soon.
//                     </p>
//                   )}
//                 </div>

//                 <div className="w-full bg-white dark:bg-gray-700 rounded-lg shadow-xl overflow-hidden mt-12">
//                   <div className="max-w-4xl mx-auto px-6 py-6">
//                     <div className="flex flex-col items-center space-y-4">
//                       <h3 className="text-xl font-bold text-gray-800 dark:text-white text-center">
//                         Add This Event to Your Story!
//                       </h3>

//                       <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
//                         Share this event with your network and help spread the
//                         word
//                       </p>

//                       <button className="w-full max-w-md px-6 py-3 bg-[#49475B] text-white font-medium rounded-lg hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#49475B]">
//                         Promote Now!
//                       </button>

//                       <div className="flex justify-center space-x-4">
//                         <a
//                           href="https://www.instagram.com"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
//                         >
//                           <Instagram size={24} className="text-[#E1306C]" />
//                         </a>
//                         <a
//                           href="https://www.facebook.com"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
//                         >
//                           <Facebook size={24} className="text-[#3b5998]" />
//                         </a>
//                         <a
//                           href="https://www.linkedin.com"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
//                         >
//                           <Linkedin size={24} className="text-[#0A66C2]" />
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="w-full bg-white dark:bg-gray-700 rounded-lg shadow-xl overflow-hidden mt-6">
//                   <div className="max-w-4xl mx-auto px-6 py-6">
//                     <div className="flex flex-col items-center space-y-4">
//                       <h3 className="text-xl font-bold text-gray-800 dark:text-white text-center">
//                         Connect with Other Attendees
//                       </h3>

//                       <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
//                         Join our Discord community to network before the event!
//                       </p>

//                       <a
//                         href="https://discord.gg/vrSj9ptDwB"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="w-full max-w-md px-6 py-3 bg-[#5865F2] text-white font-medium rounded-lg hover:bg-[#4752C4] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5865F2] flex items-center justify-center"
//                       >
//                         <svg
//                           className="h-6 w-6 mr-2"
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 24 24"
//                           fill="currentColor"
//                         >
//                           <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" />
//                         </svg>
//                         Join our Discord Server
//                       </a>

//                       <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
//                         Connect, ask questions, and network with fellow
//                         attendees
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EventDetail;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Event, EVENT_FORMAT } from "../../../lib/types/Events";
import { User } from "../../../lib/types/User";
import { USER_ROLE } from "../../../lib/types/Ticket";
import PageNotFound from "../../status/PageNotFound";
import PaymentPage from "../../payment/PaymentPage";
import PaymentSuccess from "../../payment/PaymentSuccess";
import { useEventContext } from "../../../lib/context/EventContext";
import { useTickets } from "../../../lib/context/TicketContext";
import { PencilIcon } from "@heroicons/react/20/solid";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { useAuth } from "../../../lib/hooks/useAuth";
import { UserGroupIcon } from "@heroicons/react/20/solid";
import ManageAttendeesModal from "./attendeeManagement/AttendeeManagement";
import {
  removeUsersFromEvent,
  deleteAttendeeTicket,
} from "../../../lib/services/eventService";

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getEventById, fetchEvents } = useEventContext();
  const { createTicket, userTickets } = useTickets();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [showManageAttendeesModal, setShowManageAttendeesModal] =
    useState<boolean>(false);
  const [isEventPast, setIsEventPast] = useState(false);

  //states for email promotion
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promotionEmail, setPromotionEmail] = useState("");
  const [promotionError, setPromotionError] = useState("");
  const [isPromotionSending, setIsPromotionSending] = useState(false);

  const API_BASE_URL = "http://localhost:8000";

  // Check if current user is the admin of this event
  const isEventAdmin =
    event && user && String(event.eventAdmin.id) === String(user.id);

  // Email validation function
  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle email promotion
  const handlePromoteEvent = async () => {
    // Reset previous errors
    setPromotionError("");

    // Validate email
    if (!validateEmail(promotionEmail)) {
      setPromotionError("Please enter a valid email address");
      return;
    }

    try {
      setIsPromotionSending(true);

      // Simulate sending process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      alert(`Email "sent" to ${promotionEmail}!`);

      // Close modal and reset email
      setShowPromoteModal(false);
      setPromotionEmail("");
    } catch (error) {
      console.error("Promotion error:", error);
      setPromotionError("An error occurred");
    } finally {
      setIsPromotionSending(false);
    }
  };

  // Handle edit button click
  const handleEditClick = () => {
    if (event != null) navigate(`/createevent/${event.id}`);
  };

  // Handle manage attendees button click
  const handleManageAttendeesClick = () => {
    setShowManageAttendeesModal(true);
  };

  // Handle removing users from event
  const handleRemoveUsers = async (
    userIds: string[],
    role: USER_ROLE
  ): Promise<boolean> => {
    if (!event) return false;

    if (role !== USER_ROLE.ATTENDEE) {
      console.error(
        "Only attendee removal is supported in this implementation."
      );
      return false;
    }

    try {
      // Remove the attendee ticket for each selected user
      await Promise.all(
        userIds.map(async (userId) => {
          await deleteAttendeeTicket(event.id.toString(), userId);
        })
      );

      // Update the local event state to remove the deleted attendees
      const updatedAttendees = (event.attendees || []).filter(
        (attendee) => !userIds.includes(attendee.id)
      );
      // Update the event state so the modal gets the refreshed list
      setEvent({ ...event, attendees: updatedAttendees });

      return true;
    } catch (error) {
      console.error("Error removing attendee tickets:", error);
      throw error;
    }
  };

  // Check if user is already registered for this event using TicketContext
  useEffect(() => {
    if (user && event && userTickets.length > 0) {
      // Check if the user has a ticket for this event
      const hasTicket = userTickets.some(
        (ticket) => String(ticket.eventId) === String(event.id)
      );

      console.log("user already registered to this", hasTicket);

      setIsUserRegistered(hasTicket);
      console.log(
        "User registration status:",
        hasTicket ? "Registered" : "Not registered"
      );
    }
  }, [user, event?.id, userTickets]);

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

        if (user && eventId && userTickets.length > 0) {
          // Check if the user has a ticket for this event
          const hasTicket = userTickets.some(
            (ticket) => String(ticket.eventId) === String(eventId)
          );

          console.log("user already registered to this", hasTicket);

          setIsUserRegistered(hasTicket);
          console.log(
            "User registration status:",
            hasTicket ? "Registered" : "Not registered"
          );
        }
      } catch (err) {
        setError("Failed to load event details");
        setLoading(false);
        console.error(err);
      }
    };

    fetchEventDetail();
  }, [eventId, location.state, getEventById, fetchEvents]);

  useEffect(() => {
    if (event) {
      const currentDate = new Date();
      setIsEventPast(event.endDate < currentDate);
    }
  }, [event]);

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

  // Process ticket creation
  const processTicketCreation = async () => {
    if (!event || !user) return;

    try {
      setRegistrationLoading(true);
      setRegistrationError("");

      // Create a new ticket for this user and event
      const newTicket = {
        userId: user.id,
        eventId: event.id,
        role: USER_ROLE.ATTENDEE,
        registrationDate: new Date(),
      };

      const createdTicket = await createTicket(newTicket);
      console.log("Ticket created successfully:", createdTicket);

      // Update registration status
      setIsUserRegistered(true);
      setShowPaymentSuccess(true);
    } catch (err: any) {
      console.error("Error creating ticket:", err);
      setRegistrationError(
        err.message || "Failed to register for this event. Please try again."
      );
    } finally {
      setRegistrationLoading(false);
    }
  };

  // Handle initial registration button click
  const registerForEvent = async () => {
    if (!event) return;
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate("/signin", { state: { redirect: `/det/${eventId}` } });
      return;
    }

    // Don't proceed if already registered
    if (isUserRegistered) {
      return;
    }

    try {
      if (event.isFree) {
        // For free events, create the ticket immediately
        await processTicketCreation();
      } else {
        // For paid events, show the payment page first
        console.log("Showing payment page for paid event");
        setShowPaymentPage(true);
      }
    } catch (err: any) {
      console.error("Error during registration process:", err);
      setRegistrationError(
        err.message || "Failed to register for this event. Please try again."
      );
    }
  };

  // Handle successful payment (for paid events)
  const handlePaymentSuccess = async () => {
    // Only create the ticket after successful payment
    try {
      await processTicketCreation();
      setShowPaymentPage(false);
    } catch (err: any) {
      console.error("Error after payment:", err);
      setRegistrationError(
        err.message ||
          "Payment was successful, but we couldn't complete registration. Please contact support."
      );
    }
  };

  // Promotion Modal Component
  const PromotionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center min-h-screen overflow-y-auto p-4">
      <div className="bg-white rounded-lg p-6 w-96 my-auto">
        <h2 className="text-xl font-bold mb-4">Share The Event!</h2>

        {promotionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {promotionError}
          </div>
        )}

        <input
          type="email"
          value={promotionEmail}
          onChange={(e) => setPromotionEmail(e.target.value)}
          placeholder="Enter recipient's email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowPromoteModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handlePromoteEvent}
            disabled={isPromotionSending}
            className={`px-4 py-2 ${
              isPromotionSending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#49475B] text-white hover:bg-gray-700"
            } rounded-md`}
          >
            {isPromotionSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );

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
                user.userType === "individual"
                  ? `${user.firstName} ${user.lastName}`
                  : user.organizationName
              }
              className="h-12 w-12 rounded-full object-cover"
            />
          )}
          <div>
            {user.userType === "individual" ? (
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
        onSuccess={handlePaymentSuccess}
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

  // Render the appropriate registration button based on user registration status
  const renderRegistrationButton = () => {
    if (isEventPast) {
      return (
        <div className="w-full mt-6 px-6 py-3 bg-gray-400 text-white font-medium rounded-lg text-center cursor-not-allowed">
          Event Has Ended
        </div>
      );
    }

    if (isUserRegistered) {
      return (
        <div className="w-full mt-6 px-6 py-3 bg-green-500 text-white font-medium rounded-lg text-center">
          You're Registered ✓
        </div>
      );
    } else if (remainingSpots <= 0) {
      return (
        <div className="w-full mt-6 px-6 py-3 bg-gray-400 text-white font-medium rounded-lg text-center cursor-not-allowed">
          Event Full
        </div>
      );
    } else {
      return (
        <button
          onClick={registerForEvent}
          disabled={registrationLoading || isEventPast}
          className={`w-full mt-6 px-6 py-3 ${
            registrationLoading || isEventPast
              ? "bg-gray-400"
              : "bg-[#49475B] hover:bg-gray-500"
          } text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#49475B]`}
        >
          {isEventPast ? (
            "Event Ended"
          ) : registrationLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
              Processing...
            </span>
          ) : event.isFree ? (
            "Register for Free"
          ) : (
            `Register Now • $${event.price}`
          )}
        </button>
      );
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto mt-30 px-4 pb-16 relative z-10">
        {/* Manage Attendees Modal */}
        {event && (
          <ManageAttendeesModal
            isOpen={showManageAttendeesModal}
            onClose={() => setShowManageAttendeesModal(false)}
            eventId={event.id}
            attendees={event.attendees || []}
            sponsors={event.sponsors || []}
            onRemoveUsers={handleRemoveUsers}
          />
        )}
        {/* Admin Action Bar - Only shown to event admins */}
        {isEventAdmin && (
          <div className="bg-gray-200 p-4 mb-6 rounded-md flex justify-end items-center space-x-4">
            <button
              onClick={handleManageAttendeesClick}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Manage Attendees
            </button>
            <button
              onClick={handleEditClick}
              className="flex items-center px-4 py-2 bg-[#655967] text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit Event
            </button>
          </div>
        )}

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
                      ? event.organizers[0].userType === "individual"
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

                  <div className="w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden mt-4 mb-8">
                    <div className="max-w-3xl mx-auto px-3 py-3">
                      <div className="flex flex-col items-left space-y-3">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                          Resources
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full mt-1">
                          {/* Document 1 */}
                          <div className="flex flex-col items-center">
                            <a
                              href="https://google.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-50 dark:bg-gray-600 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors flex items-center justify-center w-20 h-20"
                            >
                              <svg
                                className="h-12 w-12 text-red-600"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M23 0H9v5h5v4H0v15h14v-5h-5v-4h14V0zM5.7 17.1c-.1.1-.2.1-.3.2-.2.1-.4.1-.5.1-.3 0-.5-.1-.7-.2-.2-.1-.3-.3-.3-.5 0-.1 0-.2.1-.3 0-.1.1-.2.2-.2.1-.1.2-.1.3-.2.1 0 .2-.1.4-.1h.4c.1 0 .2 0 .4.1v.1c0 .1 0 .2.1.3 0 .1 0 .2-.1.3 0 .1 0 .2-.1.3-.1.1-.2.1-.3.2-.1-.1-.2-.1-.3-.1s-.2 0-.3.1zm3.2-2.3c-.1.1-.2.3-.3.4l-.1.1c-.2.3-.5.5-.8.7-.3.2-.7.2-1 .2-.3 0-.6-.1-.8-.2-.2-.1-.4-.3-.5-.5-.1-.2-.2-.4-.3-.7 0-.2-.1-.5-.1-.7 0-.5.1-.9.3-1.3.2-.4.5-.7.9-.9.3-.2.7-.3 1.1-.3.2 0 .5 0 .7.1.2.1.3.2.4.3.1.1.2.3.2.4 0 .2.1.3.1.5v.3c0 .2-.1.4-.1.5-.1.3-.3.5-.4.7-.2.2-.5.3-.8.3h-.2c-.1 0-.1-.1-.2-.1-.1-.1-.1-.1-.1-.2 0-.2.1-.3.2-.5.1-.1.2-.3.3-.4.1-.1.2-.3.2-.4.1-.1.1-.3.1-.3v-.1c0-.1 0-.1-.1-.2h-.1c-.2 0-.3.1-.5.2-.1.2-.3.3-.4.5-.1.2-.2.4-.2.7-.1.2-.1.5-.1.7 0 .5.1.8.2 1 .1.2.3.3.5.3.2 0 .4-.1.5-.2.2-.1.3-.3.5-.6.1-.2.2-.3.2-.5.1-.2.1-.3.2-.5v-.2c0-.1 0-.1.1-.1h.2c.2 0 .3.1.3.2.1.1.1.3.1.4 0 .1 0 .3-.1.4 0 .2-.1.3-.2.5zm-.8-5.3c0-.2.1-.3.2-.4s.2-.1.4-.1c.1 0 .2 0 .3.1.1.1.1.2.1.3 0 .1 0 .2-.1.3-.1.1-.2.1-.3.1-.1 0-.2 0-.3-.1-.1-.1-.2-.2-.3-.2zm4.4 6.5c0 .2-.1.4-.3.5-.2.1-.4.2-.7.2-.1 0-.3 0-.5-.1-.1-.1-.2-.1-.3-.2-.1-.1-.2-.2-.2-.3-.1-.1-.1-.3-.1-.4 0-.2 0-.4.1-.5.1-.1.1-.3.2-.4.1-.1.2-.2.4-.2.1-.1.3-.1.4-.1h.1c.1 0 .2 0 .3.1.1 0 .2.1.2.2.1.1.1.1.1.2 0 .1.1.1.1.2v.3c.1 0 .1.1.1.2 0 .1.1.2.1.3zm5.7-10.3c-.2.2-.4.6-.6.9-.2.3-.4.7-.6 1.1-.3.4-.5.8-.8 1.2-.5.8-1 1.6-1.4 2.4-.1.1-.1.2-.1.3-.2.4-.4.9-.6 1.3l-.3.6c-.1.3-.3.7-.4 1 0 .1-.1.2-.1.2-.1.3-.2.5-.2.8-.1.4-.1.7-.1 1.1 0 .2 0 .5.1.7.1.2.2.3.4.3h.1c.2 0 .4-.1.7-.3.2-.2.4-.4.6-.7.2-.3.3-.5.5-.8.1-.3.3-.6.4-.9.1-.3.2-.5.2-.8.1-.3.1-.5.2-.7 0-.1.1-.1.1-.1.1 0 .1 0 .2.1v.1c0 .3-.1.7-.2 1s-.2.6-.4 1c-.2.3-.3.6-.5.9-.2.3-.4.6-.6.8-.2.2-.5.4-.7.6-.3.1-.5.2-.8.2-.3 0-.5-.1-.7-.2-.2-.1-.3-.3-.4-.5-.1-.2-.2-.4-.2-.6-.1-.2-.1-.5-.1-.7 0-.5.1-1 .2-1.5.1-.5.4-1 .6-1.5.3-.5.6-1 .9-1.5.3-.5.6-1 1-1.5.3-.5.6-.9.9-1.3.3-.4.6-.8.8-1.1.1-.1.1-.2.2-.3H13v-.1c0-.1-.1-.2-.2-.3H6v-.8c.1 0 .1-.1.2-.1h7.8c.1 0 .2 0 .3.1.1.1.2.1.2.2.1.1.1.2.1.3 0 .1 0 .2-.1.3 0 .4-.2.6-.2.8z" />
                              </svg>
                            </a>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-200 mt-1">
                              Syllabus
                            </span>
                          </div>

                          {/* Document 2 */}
                          <div className="flex flex-col items-center">
                            <a
                              href="https://google.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-50 dark:bg-gray-600 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors flex items-center justify-center w-20 h-20"
                            >
                              <svg
                                className="h-12 w-12 text-red-600"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M23 0H9v5h5v4H0v15h14v-5h-5v-4h14V0zM5.7 17.1c-.1.1-.2.1-.3.2-.2.1-.4.1-.5.1-.3 0-.5-.1-.7-.2-.2-.1-.3-.3-.3-.5 0-.1 0-.2.1-.3 0-.1.1-.2.2-.2.1-.1.2-.1.3-.2.1 0 .2-.1.4-.1h.4c.1 0 .2 0 .4.1v.1c0 .1 0 .2.1.3 0 .1 0 .2-.1.3 0 .1 0 .2-.1.3-.1.1-.2.1-.3.2-.1-.1-.2-.1-.3-.1s-.2 0-.3.1zm3.2-2.3c-.1.1-.2.3-.3.4l-.1.1c-.2.3-.5.5-.8.7-.3.2-.7.2-1 .2-.3 0-.6-.1-.8-.2-.2-.1-.4-.3-.5-.5-.1-.2-.2-.4-.3-.7 0-.2-.1-.5-.1-.7 0-.5.1-.9.3-1.3.2-.4.5-.7.9-.9.3-.2.7-.3 1.1-.3.2 0 .5 0 .7.1.2.1.3.2.4.3.1.1.2.3.2.4 0 .2.1.3.1.5v.3c0 .2-.1.4-.1.5-.1.3-.3.5-.4.7-.2.2-.5.3-.8.3h-.2c-.1 0-.1-.1-.2-.1-.1-.1-.1-.1-.1-.2 0-.2.1-.3.2-.5.1-.1.2-.3.3-.4.1-.1.2-.3.2-.4.1-.1.1-.3.1-.3v-.1c0-.1 0-.1-.1-.2h-.1c-.2 0-.3.1-.5.2-.1.2-.3.3-.4.5-.1.2-.2.4-.2.7-.1.2-.1.5-.1.7 0 .5.1.8.2 1 .1.2.3.3.5.3.2 0 .4-.1.5-.2.2-.1.3-.3.5-.6.1-.2.2-.3.2-.5.1-.2.1-.3.2-.5v-.2c0-.1 0-.1.1-.1h.2c.2 0 .3.1.3.2.1.1.1.3.1.4 0 .1 0 .3-.1.4 0 .2-.1.3-.2.5zm-.8-5.3c0-.2.1-.3.2-.4s.2-.1.4-.1c.1 0 .2 0 .3.1.1.1.1.2.1.3 0 .1 0 .2-.1.3-.1.1-.2.1-.3.1-.1 0-.2 0-.3-.1-.1-.1-.2-.2-.3-.2zm4.4 6.5c0 .2-.1.4-.3.5-.2.1-.4.2-.7.2-.1 0-.3 0-.5-.1-.1-.1-.2-.1-.3-.2-.1-.1-.2-.2-.2-.3-.1-.1-.1-.3-.1-.4 0-.2 0-.4.1-.5.1-.1.1-.3.2-.4.1-.1.2-.2.4-.2.1-.1.3-.1.4-.1h.1c.1 0 .2 0 .3.1.1 0 .2.1.2.2.1.1.1.1.1.2 0 .1.1.1.1.2v.3c.1 0 .1.1.1.2 0 .1.1.2.1.3zm5.7-10.3c-.2.2-.4.6-.6.9-.2.3-.4.7-.6 1.1-.3.4-.5.8-.8 1.2-.5.8-1 1.6-1.4 2.4-.1.1-.1.2-.1.3-.2.4-.4.9-.6 1.3l-.3.6c-.1.3-.3.7-.4 1 0 .1-.1.2-.1.2-.1.3-.2.5-.2.8-.1.4-.1.7-.1 1.1 0 .2 0 .5.1.7.1.2.2.3.4.3h.1c.2 0 .4-.1.7-.3.2-.2.4-.4.6-.7.2-.3.3-.5.5-.8.1-.3.3-.6.4-.9.1-.3.2-.5.2-.8.1-.3.1-.5.2-.7 0-.1.1-.1.1-.1.1 0 .1 0 .2.1v.1c0 .3-.1.7-.2 1s-.2.6-.4 1c-.2.3-.3.6-.5.9-.2.3-.4.6-.6.8-.2.2-.5.4-.7.6-.3.1-.5.2-.8.2-.3 0-.5-.1-.7-.2-.2-.1-.3-.3-.4-.5-.1-.2-.2-.4-.2-.6-.1-.2-.1-.5-.1-.7 0-.5.1-1 .2-1.5.1-.5.4-1 .6-1.5.3-.5.6-1 .9-1.5.3-.5.6-1 1-1.5.3-.5.6-.9.9-1.3.3-.4.6-.8.8-1.1.1-.1.1-.2.2-.3H13v-.1c0-.1-.1-.2-.2-.3H6v-.8c.1 0 .1-.1.2-.1h7.8c.1 0 .2 0 .3.1.1.1.2.1.2.2.1.1.1.2.1.3 0 .1 0 .2-.1.3 0 .4-.2.6-.2.8z" />
                              </svg>
                            </a>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-200 mt-1">
                              Set Yourself Up
                            </span>
                          </div>
                          {/* Document 3 */}
                          <div className="flex flex-col items-center">
                            <a
                              href="https://google.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-50 dark:bg-gray-600 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors flex items-center justify-center w-20 h-20"
                            >
                              <svg
                                className="h-12 w-12 text-red-600"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M23 0H9v5h5v4H0v15h14v-5h-5v-4h14V0zM5.7 17.1c-.1.1-.2.1-.3.2-.2.1-.4.1-.5.1-.3 0-.5-.1-.7-.2-.2-.1-.3-.3-.3-.5 0-.1 0-.2.1-.3 0-.1.1-.2.2-.2.1-.1.2-.1.3-.2.1 0 .2-.1.4-.1h.4c.1 0 .2 0 .4.1v.1c0 .1 0 .2.1.3 0 .1 0 .2-.1.3 0 .1 0 .2-.1.3-.1.1-.2.1-.3.2-.1-.1-.2-.1-.3-.1s-.2 0-.3.1zm3.2-2.3c-.1.1-.2.3-.3.4l-.1.1c-.2.3-.5.5-.8.7-.3.2-.7.2-1 .2-.3 0-.6-.1-.8-.2-.2-.1-.4-.3-.5-.5-.1-.2-.2-.4-.3-.7 0-.2-.1-.5-.1-.7 0-.5.1-.9.3-1.3.2-.4.5-.7.9-.9.3-.2.7-.3 1.1-.3.2 0 .5 0 .7.1.2.1.3.2.4.3.1.1.2.3.2.4 0 .2.1.3.1.5v.3c0 .2-.1.4-.1.5-.1.3-.3.5-.4.7-.2.2-.5.3-.8.3h-.2c-.1 0-.1-.1-.2-.1-.1-.1-.1-.1-.1-.2 0-.2.1-.3.2-.5.1-.1.2-.3.3-.4.1-.1.2-.3.2-.4.1-.1.1-.3.1-.3v-.1c0-.1 0-.1-.1-.2h-.1c-.2 0-.3.1-.5.2-.1.2-.3.3-.4.5-.1.2-.2.4-.2.7-.1.2-.1.5-.1.7 0 .5.1.8.2 1 .1.2.3.3.5.3.2 0 .4-.1.5-.2.2-.1.3-.3.5-.6.1-.2.2-.3.2-.5.1-.2.1-.3.2-.5v-.2c0-.1 0-.1.1-.1h.2c.2 0 .3.1.3.2.1.1.1.3.1.4 0 .1 0 .3-.1.4 0 .2-.1.3-.2.5zm-.8-5.3c0-.2.1-.3.2-.4s.2-.1.4-.1c.1 0 .2 0 .3.1.1.1.1.2.1.3 0 .1 0 .2-.1.3-.1.1-.2.1-.3.1-.1 0-.2 0-.3-.1-.1-.1-.2-.2-.3-.2zm4.4 6.5c0 .2-.1.4-.3.5-.2.1-.4.2-.7.2-.1 0-.3 0-.5-.1-.1-.1-.2-.1-.3-.2-.1-.1-.2-.2-.2-.3-.1-.1-.1-.3-.1-.4 0-.2 0-.4.1-.5.1-.1.1-.3.2-.4.1-.1.2-.2.4-.2.1-.1.3-.1.4-.1h.1c.1 0 .2 0 .3.1.1 0 .2.1.2.2.1.1.1.1.1.2 0 .1.1.1.1.2v.3c.1 0 .1.1.1.2 0 .1.1.2.1.3zm5.7-10.3c-.2.2-.4.6-.6.9-.2.3-.4.7-.6 1.1-.3.4-.5.8-.8 1.2-.5.8-1 1.6-1.4 2.4-.1.1-.1.2-.1.3-.2.4-.4.9-.6 1.3l-.3.6c-.1.3-.3.7-.4 1 0 .1-.1.2-.1.2-.1.3-.2.5-.2.8-.1.4-.1.7-.1 1.1 0 .2 0 .5.1.7.1.2.2.3.4.3h.1c.2 0 .4-.1.7-.3.2-.2.4-.4.6-.7.2-.3.3-.5.5-.8.1-.3.3-.6.4-.9.1-.3.2-.5.2-.8.1-.3.1-.5.2-.7 0-.1.1-.1.1-.1.1 0 .1 0 .2.1v.1c0 .3-.1.7-.2 1s-.2.6-.4 1c-.2.3-.3.6-.5.9-.2.3-.4.6-.6.8-.2.2-.5.4-.7.6-.3.1-.5.2-.8.2-.3 0-.5-.1-.7-.2-.2-.1-.3-.3-.4-.5-.1-.2-.2-.4-.2-.6-.1-.2-.1-.5-.1-.7 0-.5.1-1 .2-1.5.1-.5.4-1 .6-1.5.3-.5.6-1 .9-1.5.3-.5.6-1 1-1.5.3-.5.6-.9.9-1.3.3-.4.6-.8.8-1.1.1-.1.1-.2.2-.3H13v-.1c0-.1-.1-.2-.2-.3H6v-.8c.1 0 .1-.1.2-.1h7.8c.1 0 .2 0 .3.1.1.1.2.1.2.2.1.1.1.2.1.3 0 .1 0 .2-.1.3 0 .4-.2.6-.2.8z" />
                              </svg>
                            </a>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-200 mt-1">
                              Event Slides
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
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
                          {event.eventAdmin.userType === "individual"
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

                  {/* Registration error message */}
                  {registrationError && (
                    <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                      {registrationError}
                    </div>
                  )}

                  {/* Registration button - using the render function */}
                  {renderRegistrationButton()}

                  {/* Render PaymentSuccess for events */}
                  {showPaymentSuccess && (
                    <PaymentSuccess
                      eventName={event.name}
                      isVisible={showPaymentSuccess}
                      onClose={() => setShowPaymentSuccess(false)}
                    />
                  )}

                  {isNearlyFull && !isUserRegistered && remainingSpots > 0 && (
                    <p className="text-center text-sm text-red-500 dark:text-red-400 mt-2">
                      Almost sold out! Register soon.
                    </p>
                  )}
                </div>

                <div className="w-full bg-white dark:bg-gray-700 rounded-lg shadow-xl overflow-hidden mt-12">
                  <div className="max-w-4xl mx-auto px-6 py-6">
                    <div className="flex flex-col items-center space-y-4">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white text-center">
                        Add This Event to Your Story!
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                        Share this event with your network and help spread the
                        word
                      </p>

                      <button
                        onClick={() => setShowPromoteModal(true)}
                        className="w-full max-w-md px-6 py-3 bg-[#49475B] text-white font-medium rounded-lg hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#49475B]"
                      >
                        Promote Now!
                      </button>
                      {showPromoteModal && <PromotionModal />}

                      <div className="flex justify-center space-x-4">
                        <a
                          href="https://www.instagram.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        >
                          <Instagram size={24} className="text-[#E1306C]" />
                        </a>
                        <a
                          href="https://www.facebook.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        >
                          <Facebook size={24} className="text-[#3b5998]" />
                        </a>
                        <a
                          href="https://www.linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        >
                          <Linkedin size={24} className="text-[#0A66C2]" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-white dark:bg-gray-700 rounded-lg shadow-xl overflow-hidden mt-6">
                  <div className="max-w-4xl mx-auto px-6 py-6">
                    <div className="flex flex-col items-center space-y-4">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white text-center">
                        Connect with Other Attendees
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                        Join our Discord community to network before the event!
                      </p>

                      <a
                        href="https://discord.gg/vrSj9ptDwB"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full max-w-md px-6 py-3 bg-[#5865F2] text-white font-medium rounded-lg hover:bg-[#4752C4] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5865F2] flex items-center justify-center"
                      >
                        <svg
                          className="h-6 w-6 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" />
                        </svg>
                        Join our Discord Server
                      </a>

                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Connect, ask questions, and network with fellow
                        attendees
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetail;
