import CreateEvent from "../components/events/eventPlanning/CreateEvent";
import Footer from "../components/footer/Footer";
import SignInRequired from "../components/status/SignInRequired";
import { useAuth } from "../lib/hooks/useAuth";

export default function CreateEventPage() {
  const { user } = useAuth();
  return (
    <>
      {user ? (
        <>
          <CreateEvent />
        </>
      ) : (
        <>
          <SignInRequired message="Sign in to create an event" />
        </>
      )}
      <Footer />
    </>
  );
}
