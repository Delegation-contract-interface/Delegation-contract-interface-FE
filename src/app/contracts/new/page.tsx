"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ToolSelector from "@/components/contract/ToolSelector";
import { DelegationContract } from "@/types/contract";

/** 위임 계약 생성 폼 페이지. 이름·설명·허용 툴을 입력하고 BE에 저장한다. */
export default function NewContractPage() {
  const router = useRouter();
  const [form, setForm] = useState<DelegationContract>({
    name: "",
    description: "",
    allowedTools: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("계약 이름을 입력해주세요.");
      return;
    }
    if (form.allowedTools.length === 0) {
      setError("허용할 작업을 하나 이상 선택해주세요.");
      return;
    }
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contracts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          allowed_tools: form.allowedTools,
        }),
      });
      if (!res.ok) throw new Error("저장에 실패했다.");
      router.push("/contracts");
    } catch {
      setError("계약 저장 중 오류가 발생했다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">위임 계약 만들기</h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            취소
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">기본 정보</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  계약 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="예: 파일 읽기 전용 에이전트"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="이 AI가 어떤 역할을 하는지 설명해주세요."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">허용할 작업</h2>
              {form.allowedTools.length > 0 && (
                <span className="text-xs text-gray-400">{form.allowedTools.length}개 선택됨</span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              선택하지 않은 작업은 실행 전 운영자에게 확인을 요청합니다.
            </p>
            <ToolSelector
              selectedTools={form.allowedTools}
              onChange={(tools) => setForm({ ...form, allowedTools: tools })}
            />
          </section>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "저장 중..." : "계약 저장"}
          </button>
        </form>
      </main>
    </div>
  );
}
