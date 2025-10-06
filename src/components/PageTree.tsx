import React, { useState } from "react";
import { Page } from "../types";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  FileText,
  Trash2,
} from "lucide-react";
import { useNotes } from "../context/NotesContext";

interface PageTreeItemProps {
  page: Page;
  level?: number;
}

const PageTreeItem: React.FC<PageTreeItemProps> = ({ page, level = 0 }) => {
  const {
    getChildPages,
    setCurrentPage,
    currentPageId,
    deletePage,
    createPage,
  } = useNotes();
  const [isExpanded, setIsExpanded] = useState(true);
  const childPages = getChildPages(page.id);
  const hasChildren = childPages.length > 0;
  const isActive = currentPageId === page.id;

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
          isActive ? "bg-primary-50 dark:bg-primary-900/20" : ""
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 transition-transform"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}

        <div
          onClick={() => setCurrentPage(page.id)}
          className="flex items-center gap-2 flex-1 min-w-0"
        >
          <span className="text-lg">{page.icon || "📄"}</span>
          <span className="truncate text-sm dark:text-gray-200">
            {page.title}
          </span>
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              createPage("Untitled", page.id);
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="Add subpage"
          >
            <Plus className="w-3 h-3 dark:text-gray-300" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete "${page.title}"?`)) {
                deletePage(page.id);
              }
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="Delete page"
          >
            <Trash2 className="w-3 h-3 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {childPages.map((child) => (
            <PageTreeItem key={child.id} page={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const PageTree: React.FC = () => {
  const { getChildPages, createPage } = useNotes();
  const rootPages = getChildPages(undefined);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
          Pages
        </h2>
        <button
          onClick={() => createPage("Untitled")}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-all hover:scale-105"
          title="New page"
        >
          <Plus className="w-4 h-4 dark:text-gray-300" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {rootPages.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No pages yet</p>
            <button
              onClick={() => createPage("Getting Started")}
              className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:underline transition-colors"
            >
              Create your first page
            </button>
          </div>
        ) : (
          rootPages.map((page) => <PageTreeItem key={page.id} page={page} />)
        )}
      </div>
    </div>
  );
};
