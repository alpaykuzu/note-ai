import React, { useState, useEffect } from "react";
import { BlockEditor } from "./BlockEditor";
import { EmojiPicker } from "./EmojiPicker";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { Plus, Image as ImageIcon } from "lucide-react";
import { useNotes } from "../context/NotesContext";
import { AIAssistant } from "./AIAsistant";

export const PageEditor: React.FC = () => {
  const {
    pages,
    currentPageId,
    getPageBlocks,
    updatePage,
    createBlock,
    reorderBlocks,
  } = useNotes();

  const [aiBlockId, setAiBlockId] = useState<string | null>(null);
  const [aiBlockText, setAiBlockText] = useState<string>("");
  const [showCoverInput, setShowCoverInput] = useState(false);

  const currentPage = pages.find((p) => p.id === currentPageId);
  const blocks = currentPageId ? getPageBlocks(currentPageId) : [];

  const { getDragHandleProps, getItemClassName } = useDragAndDrop(
    blocks,
    (newOrder) => {
      if (currentPageId) {
        reorderBlocks(currentPageId, newOrder);
      }
    }
  );

  const handleTitleChange = (newTitle: string) => {
    if (currentPage) {
      updatePage(currentPage.id, { title: newTitle });
    }
  };

  const handleAIRequest = (blockId: string, text: string) => {
    setAiBlockId(blockId);
    setAiBlockText(text);
  };

  useEffect(() => {
    if (currentPageId && blocks.length === 0) {
      createBlock(currentPageId, "paragraph");
    }
  }, [currentPageId, blocks.length, createBlock]);

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
        <div className="text-center">
          <p className="text-lg">No page selected</p>
          <p className="text-sm mt-2">Create or select a page to start</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-900 transition-colors">
      {currentPage.cover && (
        <div className="relative h-64 w-full bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
          <img
            src={currentPage.cover}
            alt="Page cover"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => updatePage(currentPage.id, { cover: undefined })}
            className="absolute top-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded hover:bg-black/70 transition-colors"
          >
            Remove cover
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-8 py-12">
        {!currentPage.cover && (
          <div className="mb-4 opacity-0 hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowCoverInput(!showCoverInput)}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Add cover</span>
            </button>
            {showCoverInput && (
              <input
                type="text"
                placeholder="Enter image URL"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    updatePage(currentPage.id, {
                      cover: e.currentTarget.value,
                    });
                    setShowCoverInput(false);
                  }
                }}
                className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm dark:bg-gray-800 dark:text-gray-100"
                autoFocus
              />
            )}
          </div>
        )}

        <div className="flex items-start gap-4 mb-8">
          <EmojiPicker
            currentEmoji={currentPage.icon}
            onSelect={(emoji) => updatePage(currentPage.id, { icon: emoji })}
          />
          <input
            type="text"
            value={currentPage.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-5xl font-bold w-full bg-transparent border-none outline-none dark:text-gray-100 transition-colors"
            placeholder="Untitled"
          />
        </div>

        <div className="space-y-1">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              className={getItemClassName(index, "transition-all")}
            >
              <BlockEditor
                block={block}
                onAIRequest={handleAIRequest}
                dragHandleProps={getDragHandleProps(block.id, index)}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() =>
            currentPageId && createBlock(currentPageId, "paragraph")
          }
          className="mt-4 flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add a block</span>
        </button>
      </div>

      {aiBlockId && (
        <AIAssistant
          blockId={aiBlockId}
          text={aiBlockText}
          onClose={() => setAiBlockId(null)}
        />
      )}
    </div>
  );
};
