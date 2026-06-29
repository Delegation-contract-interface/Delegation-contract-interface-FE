"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SessionHistory } from "@/types/session";

const STATUS_LABEL: Record<string, string> = {
  running: "실행 중",
  waiting_confirmation: "승인 대기",
  completed: "완료",
  rejected: "거절됨",
  failed: "실패",
};

const STATUS_CLASS: Record<string, string> = {
  running: "bg-blue-100 text-blue-700",
  waiting_confirmation: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  failed: "bg-gray-100 text-gray-600",
};

export default function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<SessionHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
    fetch(`${apiUrl}/sessions/${sessionId}`)
      .then((res) => {
        if (!res.ok) throw new Error("세션을 찾을 수 없다.");
        return res.json();
      })
      .then((data) => setSession(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">세션 상세</h1>
          <Link href="/history" className="text-sm text-gray-500 hover:text-gray-700">
            ← 히스토리
          </Link>
        </div>

        {loading && <p className="text-sm text-gray-400">불러오는 중...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {session && (
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_CLASS[session.status]}`}>
                  {STATUS_LABEL[session.status]}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(session.created_at).toLocaleString("ko-KR")}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-800">{session.user_message}</p>
              {session.result && (
                <p className="text-xs text-gray-500 whitespace-pre-wrap">{session.result}</p>
              )}
            </div>

            {session.logs && session.logs.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-700">툴 실행 로그</h2>
                <ul className="space-y-2">
                  {session.logs.map((log, i) => (
                    <li key={i} className="border border-gray-100 rounded-lg p-3 space-y-1 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          log.type === "confirmation"
                            ? log.approved
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {log.type === "confirmation"
                            ? log.approved ? "승인" : "거절"
                            : "툴 호출"}
                        </span>
                        <span className="text-xs font-mono text-gray-700">{log.tool_name}</span>
                      </div>
                      {log.input && (
                        <p className="text-xs text-gray-500">입력: {log.input}</p>
                      )}
                      {log.reason && (
                        <p className="text-xs text-gray-500">이유: {log.reason}</p>
                      )}
                      {log.result && (
                        <p className="text-xs text-gray-400">결과: {log.result}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(!session.logs || session.logs.length === 0) && (
              <p className="text-sm text-gray-400">로그가 없다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
