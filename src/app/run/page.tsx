"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ConfirmationModal from "@/components/session/ConfirmationModal";
import { useSessionEvents } from "@/hooks/useSessionEvents";

interface Contract {
  id: string;
  name: string;
  allowed_tools: string[];
}

type RunStatus = "idle" | "running" | "done" | "error";

export default function RunPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractsError, setContractsError] = useState("");
  const [selectedContractId, setSelectedContractId] = useState("");
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<RunStatus>("idle");
  const [result, setResult] = useState("");
  const [submitError, setSubmitError] = useState("");

  const { status: sseStatus, pendingEvent, clearPendingEvent } = useSessionEvents(sessionId);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/contracts`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setContracts)
      .catch(() => setContractsError("계약 목록을 불러오지 못했다."));
  }, []);

  useEffect(() => {
    if (sseStatus === "done" && sessionId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}`)
        .then((r) => r.json())
        .then((s) => setResult(s.result ?? "완료됐다."))
        .catch(() => setResult("완료됐다."))
        .finally(() => setRunStatus("done"));
    }
    if (sseStatus === "error") {
      setRunStatus("error");
      setResult("SSE 연결 오류가 발생했다.");
    }
  }, [sseStatus, sessionId]);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContractId) {
      setSubmitError("계약을 선택해주세요.");
      return;
    }
    if (!message.trim()) {
      setSubmitError("메시지를 입력해주세요.");
      return;
    }
    setSubmitError("");
    setRunStatus("running");
    setResult("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract_id: selectedContractId, user_message: message }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSessionId(data.session_id);
    } catch {
      setRunStatus("error");
      setResult("세션 시작에 실패했다.");
    }
  };

  const handleConfirm = async (approved: boolean) => {
    if (!sessionId) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    if (res.ok) {
      clearPendingEvent();
    }
  };

  const handleReset = () => {
    setSessionId(null);
    setRunStatus("idle");
    setResult("");
    setMessage("");
    setSubmitError("");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">에이전트 실행</h1>
          <Link href="/contracts" className="text-sm text-gray-500 hover:text-gray-700">
            계약 목록
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {runStatus === "idle" || runStatus === "running" ? (
          <form onSubmit={handleRun} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                위임 계약 <span className="text-red-500">*</span>
              </label>
              {contractsError ? (
                <p className="text-sm text-red-500">{contractsError}</p>
              ) : contracts.length === 0 ? (
                <p className="text-sm text-gray-400">
                  등록된 계약이 없다.{" "}
                  <Link href="/contracts/new" className="underline text-black">
                    계약 만들기
                  </Link>
                </p>
              ) : (
                <select
                  value={selectedContractId}
                  onChange={(e) => setSelectedContractId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">선택하세요</option>
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                메시지 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="AI에게 요청할 내용을 입력하세요."
                rows={4}
                disabled={runStatus === "running"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none disabled:opacity-50"
              />
            </div>

            {submitError && <p className="text-sm text-red-500">{submitError}</p>}

            <button
              type="submit"
              disabled={runStatus === "running"}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {runStatus === "running" ? "실행 중..." : "실행"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div
              className={`rounded-lg px-5 py-4 text-sm ${
                runStatus === "done" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              <p className="font-medium mb-1">{runStatus === "done" ? "완료" : "오류"}</p>
              <p>{result}</p>
            </div>
            <button
              onClick={handleReset}
              className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              다시 실행
            </button>
          </div>
        )}
      </main>

      {pendingEvent && (
        <ConfirmationModal event={pendingEvent} onResolve={handleConfirm} />
      )}
    </div>
  );
}
