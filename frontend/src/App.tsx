import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Landing from "./components/header/Landing";
import PageNotFound from "./components/status/PageNotFound";
import EventGallery from "./components/events/eventDashboard/EventGallery";
import DefaultNavbar from "./components/header/navbar/DefaultNavbar";
import Footer from "./components/footer/Footer";
import FilterEvents from "./components/events/eventDashboard/FilterEvents";
import EventsPage from "./components/events/EventsPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Landing />} />
          <Route path="/error" element={<PageNotFound />} />
          {/* <Route path="/gallery" element={<EventGallery />} /> */}
          <Route
            path="/nav"
            element={
              <>
                <DefaultNavbar />
                <Landing />
                <Footer />
              </>
            }
          />
          <Route path="/footer" element={<Footer />} />
          {/* <Route path="/try" element={<FilterEvents />} /> */}
          <Route
            path="/events"
            element={
              <>
                <DefaultNavbar />
                <EventsPage />
              </>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
