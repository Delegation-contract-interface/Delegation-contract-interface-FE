"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatsData } from "@/types/stats";

const STATUS_LABEL: Record<string, string> = {
  completed: "완료",
  rejected: "거절됨",
  failed: "실패",
  running: "실행 중",
  waiting_confirmation: "승인 대기",
};

const STATUS_COLOR: Record<string, string> = {
  completed: "bg-green-500",
  rejected: "bg-red-500",
  failed: "bg-gray-400",
  running: "bg-blue-500",
  waiting_confirmation: "bg-yellow-500",
};

/** 세션 기반 AI 자율성 통계를 시각화하는 대시보드 페이지. */
export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
    fetch(`${apiUrl}/stats`)
      .then((res) => {
        if (!res.ok) throw new Error("통계를 불러오지 못했다.");
        return res.json();
      })
      .then(setStats)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const toolEntries = stats ? Object.entries(stats.tool_usage) : [];
  const maxToolCount = toolEntries.length > 0 ? Math.max(...toolEntries.map(([, v]) => v)) : 1;

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">통계 대시보드</h1>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← 홈
          </Link>
        </div>

        {loading && <p className="text-sm text-gray-400">불러오는 중...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {stats && (
          <>
            {/* 총 세션 수 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-5 space-y-1">
                <p className="text-xs text-gray-500">총 세션</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_sessions}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5 space-y-1">
                <p className="text-xs text-gray-500">경계 초과 요청</p>
                <p className="text-3xl font-bold text-gray-900">{stats.confirmation.total}</p>
              </div>
            </div>

            {/* 경계 확인 승인/거절 */}
            <div className="border border-gray-200 rounded-lg p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">Human-in-the-Loop 현황</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.confirmation.approved}</p>
                  <p className="text-xs text-gray-500 mt-1">승인</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-500">{stats.confirmation.rejected}</p>
                  <p className="text-xs text-gray-500 mt-1">거절</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.confirmation.approval_rate}%</p>
                  <p className="text-xs text-gray-500 mt-1">승인율</p>
                </div>
              </div>
              {stats.confirmation.total > 0 && (
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${stats.confirmation.approval_rate}%` }}
                  />
                </div>
              )}
            </div>

            {/* 세션 상태별 분포 */}
            <div className="border border-gray-200 rounded-lg p-5 space-y-3">
              <h2 className="text-sm font-semibold text-gray-700">세션 상태 분포</h2>
              {Object.entries(stats.status_counts).map(([status, count]) => (
                <div key={status} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-20 shrink-0">
                    {STATUS_LABEL[status] ?? status}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${STATUS_COLOR[status] ?? "bg-gray-400"}`}
                      style={{ width: `${(count / stats.total_sessions) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>

            {/* 툴 사용 빈도 */}
            {toolEntries.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-5 space-y-3">
                <h2 className="text-sm font-semibold text-gray-700">툴 사용 빈도</h2>
                {toolEntries.map(([tool, count]) => (
                  <div key={tool} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-600 w-28 shrink-0 truncate">{tool}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${(count / maxToolCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
