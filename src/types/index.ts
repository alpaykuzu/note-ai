export type BlockType =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bullet"
  | "numbered"
  | "checkbox"
  | "code";

export interface BlockContent {
  text: string;
  checked?: boolean;
  language?: string;
}

export interface Block {
  id: string;
  pageId: string;
  type: BlockType;
  content: BlockContent;
  position: number;
  parentBlockId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  title: string;
  icon?: string;
  cover?: string;
  parentId?: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface AIPromptType {
  id: string;
  label: string;
  prompt: string;
}

export interface AIRequest {
  blockId: string;
  promptType: string;
  customPrompt?: string;
}

export interface AIResponse {
  blockId: string;
  result: string;
}
