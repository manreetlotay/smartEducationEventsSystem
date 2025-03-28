import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Event } from "../../../../lib/types/Events";
import { useEventContext } from "../../../../lib/context/EventContext";

interface WithEditEventProps {
  event?: Event;
}

function editEventWrapper<P extends WithEditEventProps>(
  WrappedComponent: React.ComponentType<P>
) {
  return (props: Omit<P, keyof WithEditEventProps>) => {
    const { eventId } = useParams<{ eventId: string }>();
    const { getEventById } = useEventContext();
    const [event, setEvent] = useState<Event | undefined>(undefined);

    useEffect(() => {
      if (eventId) {
        const fetchedEvent = getEventById(eventId);
        if (fetchedEvent) {
          setEvent(fetchedEvent);
        }
      }
    }, [eventId, getEventById]);

    return <WrappedComponent {...(props as P)} event={event} />;
  };
}

export default editEventWrapper;