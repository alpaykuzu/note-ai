import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Page, Block, BlockType } from "../types";
import { StorageService } from "../services/storage";

interface NotesContextType {
  pages: Page[];
  blocks: Block[];
  currentPageId: string | null;
  selectedBlockId: string | null;
  createPage: (title: string, parentId?: string) => Page;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  deletePage: (pageId: string) => void;
  setCurrentPage: (pageId: string) => void;
  createBlock: (pageId: string, type: BlockType, position?: number) => Block;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  reorderBlocks: (pageId: string, blockIds: string[]) => void;
  setSelectedBlock: (blockId: string | null) => void;
  getPageBlocks: (pageId: string) => Block[];
  getChildPages: (parentId?: string) => Page[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  useEffect(() => {
    const loadedPages = StorageService.getPages();
    const loadedBlocks = StorageService.getBlocks();
    const savedCurrentPageId = StorageService.getCurrentPageId();

    setPages(loadedPages);
    setBlocks(loadedBlocks);

    if (
      savedCurrentPageId &&
      loadedPages.find((p) => p.id === savedCurrentPageId)
    ) {
      setCurrentPageId(savedCurrentPageId);
    } else if (loadedPages.length > 0) {
      setCurrentPageId(loadedPages[0].id);
    }
  }, []);

  const createPage = useCallback(
    (title: string, parentId?: string): Page => {
      const newPage: Page = {
        id: crypto.randomUUID(),
        title,
        parentId,
        position: pages.filter((p) => p.parentId === parentId).length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      StorageService.savePage(newPage);
      setPages((prev) => [...prev, newPage]);

      return newPage;
    },
    [pages]
  );

  const updatePage = useCallback((pageId: string, updates: Partial<Page>) => {
    setPages((prev) => {
      const updated = prev.map((p) =>
        p.id === pageId
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      );
      const page = updated.find((p) => p.id === pageId);
      if (page) {
        StorageService.savePage(page);
      }
      return updated;
    });
  }, []);

  const deletePage = useCallback(
    (pageId: string) => {
      StorageService.deletePage(pageId);
      setPages((prev) =>
        prev.filter((p) => p.id !== pageId && p.parentId !== pageId)
      );
      setBlocks((prev) => prev.filter((b) => b.pageId !== pageId));

      if (currentPageId === pageId) {
        const remainingPages = pages.filter((p) => p.id !== pageId);
        setCurrentPageId(
          remainingPages.length > 0 ? remainingPages[0].id : null
        );
      }
    },
    [currentPageId, pages]
  );

  const setCurrentPage = useCallback((pageId: string) => {
    setCurrentPageId(pageId);
    StorageService.setCurrentPageId(pageId);
    setSelectedBlockId(null);
  }, []);

  const createBlock = useCallback(
    (pageId: string, type: BlockType, position?: number): Block => {
      const pageBlocks = blocks.filter((b) => b.pageId === pageId);
      const newBlock: Block = {
        id: crypto.randomUUID(),
        pageId,
        type,
        content: { text: "" },
        position: position ?? pageBlocks.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      StorageService.saveBlock(newBlock);
      setBlocks((prev) => [...prev, newBlock]);

      return newBlock;
    },
    [blocks]
  );

  const updateBlock = useCallback(
    (blockId: string, updates: Partial<Block>) => {
      setBlocks((prev) => {
        const updated = prev.map((b) =>
          b.id === blockId
            ? { ...b, ...updates, updatedAt: new Date().toISOString() }
            : b
        );
        const block = updated.find((b) => b.id === blockId);
        if (block) {
          StorageService.saveBlock(block);
        }
        return updated;
      });
    },
    []
  );

  const deleteBlock = useCallback((blockId: string) => {
    StorageService.deleteBlock(blockId);
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  }, []);

  const reorderBlocks = useCallback((pageId: string, blockIds: string[]) => {
    StorageService.updateBlockPositions(pageId, blockIds);
    setBlocks((prev) => {
      const updated = [...prev];
      blockIds.forEach((id, index) => {
        const block = updated.find((b) => b.id === id);
        if (block) {
          block.position = index;
        }
      });
      return updated;
    });
  }, []);

  const getPageBlocks = useCallback(
    (pageId: string): Block[] => {
      return blocks
        .filter((b) => b.pageId === pageId)
        .sort((a, b) => a.position - b.position);
    },
    [blocks]
  );

  const getChildPages = useCallback(
    (parentId?: string): Page[] => {
      return pages
        .filter((p) => p.parentId === parentId)
        .sort((a, b) => a.position - b.position);
    },
    [pages]
  );

  return (
    <NotesContext.Provider
      value={{
        pages,
        blocks,
        currentPageId,
        selectedBlockId,
        createPage,
        updatePage,
        deletePage,
        setCurrentPage,
        createBlock,
        updateBlock,
        deleteBlock,
        reorderBlocks,
        setSelectedBlock: setSelectedBlockId,
        getPageBlocks,
        getChildPages,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within NotesProvider");
  }
  return context;
};
