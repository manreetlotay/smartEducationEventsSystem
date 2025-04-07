import Footer from "../components/footer/Footer";
import SignInRequired from "../components/status/SignInRequired";
import TicketsPage from "../components/ticket/TicketsPage";
import { useAuth } from "../lib/hooks/useAuth";

export default function MyTicketsPage() {
  const { user } = useAuth();
  return (
    <>
      {user ? (
        <>
          <TicketsPage />
        </>
      ) : (
        <>
          <SignInRequired message="Sign in to view your tickets" />
        </>
      )}
      <Footer />
    </>
  );
}
