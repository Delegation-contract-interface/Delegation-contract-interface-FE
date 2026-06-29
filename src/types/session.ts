export type SessionStatus = "running" | "waiting_confirmation" | "completed" | "rejected" | "failed";

export interface SessionLog {
  type: "tool_call" | "confirmation";
  tool_name: string;
  input?: string | null;
  result?: string | null;
  reason?: string | null;
  approved?: boolean | null;
}

export interface SessionHistory {
  session_id: string;
  contract_id: string;
  user_message: string;
  status: SessionStatus;
  result: string | null;
  logs: SessionLog[];
  created_at: string;
}
