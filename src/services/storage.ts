import { Page, Block } from "../types";
import { STORAGE_KEYS } from "../constants";

export class StorageService {
  static getPages(): Page[] {
    const data = localStorage.getItem(STORAGE_KEYS.PAGES);
    return data ? JSON.parse(data) : [];
  }

  static savePage(page: Page): void {
    const pages = this.getPages();
    const index = pages.findIndex((p) => p.id === page.id);

    if (index >= 0) {
      pages[index] = { ...page, updatedAt: new Date().toISOString() };
    } else {
      pages.push(page);
    }

    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pages));
  }

  static deletePage(pageId: string): void {
    const pages = this.getPages().filter(
      (p) => p.id !== pageId && p.parentId !== pageId
    );
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pages));

    const blocks = this.getBlocks().filter((b) => b.pageId !== pageId);
    localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
  }

  static getBlocks(pageId?: string): Block[] {
    const data = localStorage.getItem(STORAGE_KEYS.BLOCKS);
    const blocks: Block[] = data ? JSON.parse(data) : [];

    if (pageId) {
      return blocks
        .filter((b) => b.pageId === pageId)
        .sort((a, b) => a.position - b.position);
    }

    return blocks;
  }

  static saveBlock(block: Block): void {
    const blocks = this.getBlocks();
    const index = blocks.findIndex((b) => b.id === block.id);

    if (index >= 0) {
      blocks[index] = { ...block, updatedAt: new Date().toISOString() };
    } else {
      blocks.push(block);
    }

    localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
  }

  static deleteBlock(blockId: string): void {
    const blocks = this.getBlocks().filter(
      (b) => b.id !== blockId && b.parentBlockId !== blockId
    );
    localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
  }

  static updateBlockPositions(_pageId: string, blockIds: string[]): void {
    const blocks = this.getBlocks();

    blockIds.forEach((id, index) => {
      const block = blocks.find((b) => b.id === id);
      if (block) {
        block.position = index;
        block.updatedAt = new Date().toISOString();
      }
    });

    localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
  }

  static getCurrentPageId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE);
  }

  static setCurrentPageId(pageId: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, pageId);
  }

  static getGeminiApiKey(): string | null {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
  }

  static setGeminiApiKey(apiKey: string): void {
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, apiKey);
  }
}
