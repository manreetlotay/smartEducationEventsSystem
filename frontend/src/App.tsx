import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Footer from "./components/footer/Footer";
import { EventProvider } from "./lib/context/EventContext";
import Home from "./views/Home";
import BrowseEvents from "./views/BrowseEvents";
import EventDet from "./views/EventDet";
import MyCreatedEvents from "./views/MyCreatedEvents";
import CreateEventPage from "./views/CreateEventPage";
import CreateEvent from "./components/events/eventPlanning/CreateEvent";
import { AuthProvider } from "./lib/hooks/useAuth";

function App() {
  return (
    <>
      <AuthProvider>
        <EventProvider>
          <Router>
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
          </Router>
        </EventProvider>
      </AuthProvider>
    </>
  );
}

export default App;
