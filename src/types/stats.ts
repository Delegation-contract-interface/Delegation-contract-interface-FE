export interface StatsData {
  total_sessions: number;
  status_counts: Record<string, number>;
  confirmation: {
    total: number;
    approved: number;
    rejected: number;
    approval_rate: number;
  };
  tool_usage: Record<string, number>;
}
