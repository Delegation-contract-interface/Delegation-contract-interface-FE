import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">위임 계약 인터페이스</h1>
          <p className="text-sm text-gray-500">
            AI가 스스로 할 수 있는 것과, 물어봐야 하는 것을 정의하세요.
          </p>
        </div>
        <div className="space-y-3">
          <Link
            href="/contracts/new"
            className="inline-block w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            새 위임 계약 만들기
          </Link>
          <Link
            href="/run"
            className="inline-block w-full border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            에이전트 실행
          </Link>
          <Link
            href="/history"
            className="inline-block w-full border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            세션 히스토리
          </Link>
        </div>
      </div>
    </div>
  );
}
