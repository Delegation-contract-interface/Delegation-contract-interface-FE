"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SessionHistory, SessionStatus } from "@/types/session";

const STATUS_LABEL: Record<SessionStatus, string> = {
  running: "실행 중",
  waiting_confirmation: "승인 대기",
  completed: "완료",
  rejected: "거절됨",
  failed: "실패",
};

const STATUS_CLASS: Record<SessionStatus, string> = {
  running: "bg-blue-100 text-blue-700",
  waiting_confirmation: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  failed: "bg-gray-100 text-gray-600",
};

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
    fetch(`${apiUrl}/sessions`)
      .then((res) => {
        if (!res.ok) throw new Error("세션 목록을 불러오지 못했다.");
        return res.json();
      })
      .then((data) => setSessions(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">세션 히스토리</h1>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← 홈
          </Link>
        </div>

        {loading && (
          <p className="text-sm text-gray-400">불러오는 중...</p>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && sessions.length === 0 && (
          <p className="text-sm text-gray-400">실행된 세션이 없다.</p>
        )}

        <ul className="space-y-3">
          {sessions.map((s) => (
            <li
              key={s.session_id}
              className="border border-gray-200 rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_CLASS[s.status]}`}
                >
                  {STATUS_LABEL[s.status]}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(s.created_at).toLocaleString("ko-KR")}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-800 truncate">
                {s.user_message}
              </p>
              {s.result && (
                <p className="text-xs text-gray-500 line-clamp-2">{s.result}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
