"use client";

import { AVAILABLE_TOOLS, ToolCategory, ToolItem } from "@/types/contract";

interface Props {
  selectedTools: string[];
  onChange: (tools: string[]) => void;
}

const CATEGORIES: ToolCategory[] = ["파일", "웹", "코드 실행", "데이터베이스", "외부 API"];

export default function ToolSelector({ selectedTools, onChange }: Props) {
  const toggle = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      onChange(selectedTools.filter((id) => id !== toolId));
    } else {
      onChange([...selectedTools, toolId]);
    }
  };

  const toggleCategory = (category: ToolCategory) => {
    const ids = AVAILABLE_TOOLS.filter((t) => t.category === category).map((t) => t.id);
    const allSelected = ids.every((id) => selectedTools.includes(id));
    if (allSelected) {
      onChange(selectedTools.filter((id) => !ids.includes(id)));
    } else {
      onChange([...new Set([...selectedTools, ...ids])]);
    }
  };

  const byCategory = (category: ToolCategory): ToolItem[] =>
    AVAILABLE_TOOLS.filter((t) => t.category === category);

  return (
    <div className="space-y-3">
      {CATEGORIES.map((category) => {
        const tools = byCategory(category);
        const selectedCount = tools.filter((t) => selectedTools.includes(t.id)).length;
        const allSelected = selectedCount === tools.length;

        return (
          <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => toggleCategory(category)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 accent-black"
                />
                <span className="text-sm font-medium text-gray-800">{category}</span>
              </div>
              <span className="text-xs text-gray-400">{selectedCount}/{tools.length}</span>
            </button>

            <div className="divide-y divide-gray-100">
              {tools.map((tool) => (
                <label
                  key={tool.id}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTools.includes(tool.id)}
                    onChange={() => toggle(tool.id)}
                    className="mt-0.5 w-4 h-4 accent-black"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{tool.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{tool.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
