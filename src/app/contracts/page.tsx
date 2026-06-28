"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Contract {
  id: string;
  name: string;
  description: string;
  allowed_tools: string[];
  created_at: string;
}

/** 위임 계약 목록 페이지. BE에서 계약 목록을 조회해 표시한다. */
export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/contracts`)
      .then((res) => {
        if (!res.ok) throw new Error("불러오기 실패");
        return res.json();
      })
      .then(setContracts)
      .catch(() => setError("계약 목록을 불러오지 못했다."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">위임 계약 목록</h1>
          <Link
            href="/contracts/new"
            className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            새 계약
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {loading && <p className="text-sm text-gray-400">불러오는 중...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && contracts.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">아직 등록된 계약이 없다.</p>
            <Link href="/contracts/new" className="text-sm text-black underline mt-2 inline-block">
              첫 번째 계약 만들기
            </Link>
          </div>
        )}
        <ul className="space-y-3">
          {contracts.map((contract) => (
            <li
              key={contract.id}
              className="border border-gray-200 rounded-lg px-5 py-4 space-y-1"
            >
              <p className="text-sm font-medium text-gray-900">{contract.name}</p>
              {contract.description && (
                <p className="text-xs text-gray-500">{contract.description}</p>
              )}
              <p className="text-xs text-gray-400">
                허용 작업 {contract.allowed_tools.length}개
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
