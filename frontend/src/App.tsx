import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Footer from "./components/footer/Footer";
import { EventProvider } from "./lib/context/EventContext";
import { TicketProvider } from "./lib/context/TicketContext";
import Home from "./views/Home";
import BrowseEvents from "./views/BrowseEvents";
import EventDet from "./views/EventDet";
import MyCreatedEvents from "./views/MyCreatedEvents";
import CreateEventPage from "./views/CreateEventPage";
import CreateEvent from "./components/events/eventPlanning/CreateEvent";
import { AuthProvider } from "./lib/hooks/useAuth";
import Navbar from "./components/header/navbar/Navbar";
import MyTicketsPage from "./views/MyTicketsPage";
import NotFoundPage from "./views/NotFoundPage";

function App() {
  return (
    <>
      <AuthProvider>
        <EventProvider>
          <TicketProvider>
            <Router>
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
                <Route
                  path="/ticket"
                  element={
                    <>
                      <MyTicketsPage />
                    </>
                  }
                />
                {/* Catch-all route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
          </TicketProvider>
        </EventProvider>
      </AuthProvider>
    </>
  );
}

export default App;
