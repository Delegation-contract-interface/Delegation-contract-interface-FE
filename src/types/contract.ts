export type ToolCategory = "파일" | "웹" | "코드 실행" | "데이터베이스" | "외부 API";

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
}

export interface DelegationContract {
  id?: string;
  name: string;
  description: string;
  allowedTools: string[];
  createdAt?: string;
}

export const AVAILABLE_TOOLS: ToolItem[] = [
  { id: "read_file",  name: "파일 읽기",      description: "파일 내용을 읽는다.",          category: "파일" },
  { id: "write_file", name: "파일 쓰기",      description: "파일을 생성하거나 수정한다.",   category: "파일" },
  { id: "delete_file",name: "파일 삭제",      description: "파일을 삭제한다.",              category: "파일" },
  { id: "list_files", name: "파일 목록 조회", description: "디렉토리 파일 목록을 조회한다.", category: "파일" },
  { id: "web_search", name: "웹 검색",        description: "인터넷에서 정보를 검색한다.",   category: "웹" },
  { id: "web_fetch",  name: "웹 페이지 읽기", description: "URL의 내용을 가져온다.",        category: "웹" },
  { id: "run_code",   name: "코드 실행",      description: "코드를 실행하고 결과를 반환한다.", category: "코드 실행" },
  { id: "db_read",    name: "DB 조회",        description: "데이터베이스에서 데이터를 읽는다.", category: "데이터베이스" },
  { id: "db_write",   name: "DB 수정",        description: "데이터베이스에 데이터를 쓴다.", category: "데이터베이스" },
  { id: "api_call",   name: "외부 API 호출",  description: "외부 서비스 API를 호출한다.",   category: "외부 API" },
];
