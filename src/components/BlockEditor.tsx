/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from "react";
import { Block, BlockType } from "../types";
import { useNotes } from "../context/NotesContext";
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  GripVertical,
  Sparkles,
} from "lucide-react";

interface BlockEditorProps {
  block: Block;
  onAIRequest: (blockId: string, text: string) => void;
  dragHandleProps?: any;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({
  block,
  onAIRequest,
  dragHandleProps,
}) => {
  const {
    updateBlock,
    deleteBlock,
    createBlock,
    selectedBlockId,
    setSelectedBlock,
  } = useNotes();
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const isSelected = selectedBlockId === block.id;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [block.content.text]);

  const handleContentChange = (text: string) => {
    updateBlock(block.id, {
      content: { ...block.content, text },
    });

    if (text.startsWith("/") && text.length > 1) {
      setShowTypeMenu(true);
    } else {
      setShowTypeMenu(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      createBlock(block.pageId, "paragraph", block.position + 1);
    } else if (e.key === "Backspace" && block.content.text === "") {
      e.preventDefault();
      deleteBlock(block.id);
    }
  };

  const changeBlockType = (type: BlockType) => {
    updateBlock(block.id, { type });
    setShowTypeMenu(false);

    if (block.content.text.startsWith("/")) {
      updateBlock(block.id, {
        content: { ...block.content, text: "" },
      });
    }
  };

  const handleCheckboxToggle = () => {
    updateBlock(block.id, {
      content: { ...block.content, checked: !block.content.checked },
    });
  };

  const renderInput = () => {
    const commonClasses =
      "w-full bg-transparent border-none outline-none resize-none dark:text-gray-100 transition-colors";

    switch (block.type) {
      case "heading1":
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={block.content.text}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setSelectedBlock(block.id)}
            className={`${commonClasses} text-4xl font-bold`}
            placeholder="Heading 1"
          />
        );
      case "heading2":
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={block.content.text}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setSelectedBlock(block.id)}
            className={`${commonClasses} text-3xl font-bold`}
            placeholder="Heading 2"
          />
        );
      case "heading3":
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={block.content.text}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setSelectedBlock(block.id)}
            className={`${commonClasses} text-2xl font-bold`}
            placeholder="Heading 3"
          />
        );
      case "code":
        return (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={block.content.text}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setSelectedBlock(block.id)}
            className={`${commonClasses} font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded`}
            placeholder="Code"
          />
        );
      case "checkbox":
        return (
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={block.content.checked || false}
              onChange={handleCheckboxToggle}
              className="mt-1 rounded border-gray-300 dark:border-gray-600"
            />
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={block.content.text}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setSelectedBlock(block.id)}
              className={`${commonClasses} ${
                block.content.checked
                  ? "line-through text-gray-500 dark:text-gray-400"
                  : ""
              }`}
              placeholder="To-do"
            />
          </div>
        );
      default:
        return (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={block.content.text}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setSelectedBlock(block.id)}
            className={commonClasses}
            placeholder="Type '/' for commands"
            rows={1}
          />
        );
    }
  };

  const blockTypeOptions = [
    { type: "paragraph" as BlockType, icon: Type, label: "Text" },
    { type: "heading1" as BlockType, icon: Heading1, label: "Heading 1" },
    { type: "heading2" as BlockType, icon: Heading2, label: "Heading 2" },
    { type: "heading3" as BlockType, icon: Heading3, label: "Heading 3" },
    { type: "bullet" as BlockType, icon: List, label: "Bullet List" },
    {
      type: "numbered" as BlockType,
      icon: ListOrdered,
      label: "Numbered List",
    },
    { type: "checkbox" as BlockType, icon: CheckSquare, label: "Checkbox" },
    { type: "code" as BlockType, icon: Code, label: "Code" },
  ];

  return (
    <div
      className={`group relative flex items-start gap-2 py-1 transition-all ${
        isSelected ? "bg-primary-50 dark:bg-primary-900/10" : ""
      }`}
    >
      <div
        {...dragHandleProps}
        className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing pt-2 transition-opacity"
      >
        <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </div>

      <div className="flex-1 min-w-0">
        {block.type === "bullet" && (
          <span className="mr-2 dark:text-gray-300">•</span>
        )}
        {block.type === "numbered" && (
          <span className="mr-2 dark:text-gray-300">{block.position + 1}.</span>
        )}
        {renderInput()}

        {showTypeMenu && (
          <div className="absolute z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-2 min-w-[200px] animate-slide-in">
            {blockTypeOptions.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => changeBlockType(type)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left transition-colors"
              >
                <Icon className="w-4 h-4 dark:text-gray-300" />
                <span className="dark:text-gray-100">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {isSelected && block.content.text && (
        <button
          onClick={() => {
            setShowAIMenu(!showAIMenu);
            onAIRequest(block.id, block.content.text);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded transition-all"
          title="AI Assistant"
        >
          <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        </button>
      )}
    </div>
  );
};
