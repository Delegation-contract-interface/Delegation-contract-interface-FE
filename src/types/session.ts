export type SessionStatus = "running" | "waiting_confirmation" | "completed" | "rejected" | "failed";

export interface SessionHistory {
  session_id: string;
  contract_id: string;
  user_message: string;
  status: SessionStatus;
  result: string | null;
  created_at: string;
}
