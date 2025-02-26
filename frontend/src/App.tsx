import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Landing from "./components/header/Landing";
import PageNotFound from "./components/status/PageNotFound";
import EventGallery from "./components/events/EventGallery";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Landing />} />
          <Route path="/error" element={<PageNotFound />} />
          <Route path="/gallery" element={<EventGallery />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
