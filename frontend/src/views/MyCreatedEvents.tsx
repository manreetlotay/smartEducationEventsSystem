import MyEventsPage from "../components/events/eventPlanning/MyEventsPage";
import SignInRequired from "../components/status/SignInRequired";
import { useAuth } from "../lib/hooks/useAuth";

export default function MyCreatedEvents() {
  const { user } = useAuth();
  return (
    <>
      {user ? (
        <>
          <MyEventsPage />
        </>
      ) : (
        <>
          <SignInRequired message="Sign in to view your events" />
        </>
      )}
    </>
  );
}
