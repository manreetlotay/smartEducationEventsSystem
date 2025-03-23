import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Footer from "./components/footer/Footer";
import { EventProvider } from "./lib/context/EventContext";
import Home from "./views/Home";
import BrowseEvents from "./views/BrowseEvents";
import EventDet from "./views/EventDet";

function App() {
  return (
    <>
      <EventProvider>
        <Router>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Home />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/events" element={<BrowseEvents />} />
            <Route path="/det/:id" element={<EventDet />} />
          </Routes>
        </Router>
      </EventProvider>
    </>
  );
}

export default App;
