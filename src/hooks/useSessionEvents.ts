"use client";

import { useEffect, useRef, useState } from "react";

export interface ConfirmationEvent {
  type: "confirmation_required";
  session_id: string;
  tool_name: string;
  tool_args: Record<string, string>;
  reason: string;
}

interface DoneEvent {
  type: "done";
}

type SessionEvent = ConfirmationEvent | DoneEvent;

export type SessionEventStatus = "idle" | "connecting" | "waiting" | "done" | "error";

export function useSessionEvents(sessionId: string | null) {
  const [status, setStatus] = useState<SessionEventStatus>("idle");
  const [pendingEvent, setPendingEvent] = useState<ConfirmationEvent | null>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    setStatus("connecting");
    const es = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}/events`
    );
    esRef.current = es;

    es.onmessage = (e) => {
      const data: SessionEvent = JSON.parse(e.data);
      if (data.type === "confirmation_required") {
        setStatus("waiting");
        setPendingEvent(data);
      } else if (data.type === "done") {
        setStatus("done");
        es.close();
      }
    };

    es.onerror = () => {
      setStatus("error");
      es.close();
    };

    return () => {
      es.close();
    };
  }, [sessionId]);

  const clearPendingEvent = () => setPendingEvent(null);

  return { status, pendingEvent, clearPendingEvent };
}
