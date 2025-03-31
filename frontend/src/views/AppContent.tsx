import { Route, Router, Routes } from "react-router-dom";
import Loading from "../components/status/Loading";
import { EventProvider } from "../lib/context/EventContext";
import { useAuth } from "../lib/hooks/useAuth";
import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/SignUp";
import { Home } from "lucide-react";
import Footer from "../components/footer/Footer";
import BrowseEvents from "./BrowseEvents";
import EventDet from "./EventDet";
import MyCreatedEvents from "./MyCreatedEvents";
import CreateEventPage from "./CreateEventPage";
import CreateEvent from "../components/events/eventPlanning/CreateEvent";
import Navbar from "../components/header/navbar/Navbar";

export default function AppContent() {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return <Loading />;
  }

  return (
    <EventProvider>
      <Navbar />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/events" element={<BrowseEvents />} />
        <Route path="/det/:id" element={<EventDet />} />
        <Route path="/myevents" element={<MyCreatedEvents />} />
        <Route path="/createevent" element={<CreateEventPage />} />
        <Route
          path="/createevent/:eventId"
          element={<CreateEvent mode="edit" />}
        />
      </Routes>
    </EventProvider>
  );
}
