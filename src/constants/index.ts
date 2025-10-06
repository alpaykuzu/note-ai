import { AIPromptType } from "../types";

export const AI_PROMPT_TEMPLATES: AIPromptType[] = [
  {
    id: "expand",
    label: "Expand",
    prompt:
      "Expand the following text with more details and depth while maintaining the original meaning and tone:",
  },
  {
    id: "summarize",
    label: "Summarize",
    prompt:
      "Summarize the following text concisely while keeping the key points:",
  },
  {
    id: "improve",
    label: "Improve Writing",
    prompt:
      "Improve the clarity, grammar, and style of the following text while keeping the core message:",
  },
  {
    id: "clarify",
    label: "Clarify",
    prompt:
      "Rewrite the following text to make it clearer and easier to understand:",
  },
  {
    id: "translate",
    label: "Translate",
    prompt: "Translate the following text to Spanish:",
  },
  {
    id: "brainstorm",
    label: "Brainstorm Ideas",
    prompt:
      "Based on the following text, brainstorm 5 related ideas or next steps:",
  },
];

export const STORAGE_KEYS = {
  PAGES: "notion_pages",
  BLOCKS: "notion_blocks",
  CURRENT_PAGE: "notion_current_page",
  GEMINI_API_KEY: "notion_gemini_api_key",
};

export const BLOCK_TYPES = {
  PARAGRAPH: "paragraph",
  HEADING1: "heading1",
  HEADING2: "heading2",
  HEADING3: "heading3",
  BULLET: "bullet",
  NUMBERED: "numbered",
  CHECKBOX: "checkbox",
  CODE: "code",
} as const;
