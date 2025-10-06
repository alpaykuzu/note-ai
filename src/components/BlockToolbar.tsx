import React, { useState, useRef, useEffect } from "react";
import { BlockType } from "../types";
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Bold,
  Italic,
  Underline,
  MoreHorizontal,
} from "lucide-react";

interface BlockToolbarProps {
  currentType: BlockType;
  onTypeChange: (type: BlockType) => void;
  onFormatApply?: (format: string) => void;
  show: boolean;
  position?: { top: number; left: number };
}

export const BlockToolbar: React.FC<BlockToolbarProps> = ({
  currentType,
  onTypeChange,
  onFormatApply,
  show,
  position,
}) => {
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target as Node)
      ) {
        setShowTypeMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!show) return null;

  const blockTypes = [
    {
      type: "paragraph" as BlockType,
      icon: Type,
      label: "Text",
      shortcut: "Ctrl+Alt+0",
    },
    {
      type: "heading1" as BlockType,
      icon: Heading1,
      label: "Heading 1",
      shortcut: "Ctrl+Alt+1",
    },
    {
      type: "heading2" as BlockType,
      icon: Heading2,
      label: "Heading 2",
      shortcut: "Ctrl+Alt+2",
    },
    {
      type: "heading3" as BlockType,
      icon: Heading3,
      label: "Heading 3",
      shortcut: "Ctrl+Alt+3",
    },
    {
      type: "bullet" as BlockType,
      icon: List,
      label: "Bullet List",
      shortcut: "Ctrl+Shift+8",
    },
    {
      type: "numbered" as BlockType,
      icon: ListOrdered,
      label: "Numbered List",
      shortcut: "Ctrl+Shift+7",
    },
    {
      type: "checkbox" as BlockType,
      icon: CheckSquare,
      label: "Checkbox",
      shortcut: "Ctrl+Shift+9",
    },
    {
      type: "code" as BlockType,
      icon: Code,
      label: "Code",
      shortcut: "Ctrl+Alt+C",
    },
  ];

  const currentTypeInfo =
    blockTypes.find((t) => t.type === currentType) || blockTypes[0];

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl animate-scale-in"
      style={position ? { top: position.top, left: position.left } : {}}
    >
      <div className="flex items-center gap-1 p-1">
        <div className="relative">
          <button
            onClick={() => setShowTypeMenu(!showTypeMenu)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm font-medium transition-colors"
            title={currentTypeInfo.label}
          >
            <currentTypeInfo.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{currentTypeInfo.label}</span>
            <MoreHorizontal className="w-3 h-3" />
          </button>

          {showTypeMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-2 min-w-[240px] animate-slide-in">
              {blockTypes.map(({ type, icon: Icon, label, shortcut }) => (
                <button
                  key={type}
                  onClick={() => {
                    onTypeChange(type);
                    setShowTypeMenu(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left transition-colors ${
                    currentType === type
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{label}</span>
                  </div>
                  <span className="text-xs text-gray-400">{shortcut}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        <button
          onClick={() => onFormatApply?.("bold")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          onClick={() => onFormatApply?.("italic")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          onClick={() => onFormatApply?.("underline")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
