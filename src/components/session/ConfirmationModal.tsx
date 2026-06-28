"use client";

import { useState } from "react";
import { ConfirmationEvent } from "@/hooks/useSessionEvents";

interface Props {
  event: ConfirmationEvent;
  onResolve: (approved: boolean) => Promise<void>;
}

export default function ConfirmationModal({ event, onResolve }: Props) {
  const [loading, setLoading] = useState(false);

  const handle = async (approved: boolean) => {
    setLoading(true);
    try {
      await onResolve(approved);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6 space-y-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
            경계 초과 확인 요청
          </p>
          <h2 className="text-base font-semibold text-gray-900">
            AI가 허용되지 않은 작업을 요청했다
          </h2>
        </div>

        <div className="bg-gray-50 rounded-lg px-4 py-3 space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="text-gray-400 w-16 shrink-0">툴</span>
            <span className="font-mono text-gray-800">{event.tool_name}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-16 shrink-0">이유</span>
            <span className="text-gray-700">{event.reason}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handle(false)}
            disabled={loading}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            거절
          </button>
          <button
            onClick={() => handle(true)}
            disabled={loading}
            className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "처리 중..." : "승인"}
          </button>
        </div>
      </div>
    </div>
  );
}
