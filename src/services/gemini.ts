import { StorageService } from "./storage";

export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export class GeminiService {
  private static readonly DEFAULT_MODEL = "gemini-2.5-flash";
  private static readonly API_URL =
    "https://generativelanguage.googleapis.com/v1/models";

  static async runPrompt(
    prompt: string,
    input: string,
    config?: Partial<GeminiConfig>
  ): Promise<string> {
    const apiKey = config?.apiKey || StorageService.getGeminiApiKey();

    if (!apiKey) {
      throw new Error(
        "Gemini API key is not configured. Please add your API key in settings."
      );
    }

    const model = config?.model || this.DEFAULT_MODEL;
    const fullPrompt = `${prompt}\n\n${input}`;

    try {
      const response = await fetch(
        `${this.API_URL}/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: fullPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to generate content");
      }

      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!result) {
        throw new Error("No content generated");
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
      }
      throw new Error("An unknown error occurred while calling Gemini API");
    }
  }

  static async expand(
    text: string,
    config?: Partial<GeminiConfig>
  ): Promise<string> {
    const prompt =
      "Expand the following text with more details and depth while maintaining the original meaning and tone. Provide ONLY the expanded version without any introductory phrases or explanations:";
    return this.runPrompt(prompt, text, config);
  }

  static async summarize(
    text: string,
    config?: Partial<GeminiConfig>
  ): Promise<string> {
    const prompt =
      "Summarize the following text concisely while keeping the key points. Provide ONLY the summary without any introductory phrases:";
    return this.runPrompt(prompt, text, config);
  }

  static async improve(
    text: string,
    config?: Partial<GeminiConfig>
  ): Promise<string> {
    const prompt =
      "Improve the clarity, grammar, and style of the following text while keeping the core message. Provide ONLY the improved version without any explanations:";
    return this.runPrompt(prompt, text, config);
  }

  static async clarify(
    text: string,
    config?: Partial<GeminiConfig>
  ): Promise<string> {
    const prompt =
      "Rewrite the following text to make it clearer and easier to understand. Provide ONLY the rewritten version without any introductory text:";
    return this.runPrompt(prompt, text, config);
  }

  static async translate(
    text: string,
    targetLanguage: string = "Spanish",
    config?: Partial<GeminiConfig>
  ): Promise<string> {
    const prompt = `Translate the following text to ${targetLanguage}. Provide ONLY the translation without any additional text:`;
    return this.runPrompt(prompt, text, config);
  }

  static async brainstorm(
    text: string,
    config?: Partial<GeminiConfig>
  ): Promise<string> {
    const prompt =
      "Based on the following text, brainstorm 5 related ideas or next steps. Provide ONLY the ideas in a clear list format without introductory phrases:";
    return this.runPrompt(prompt, text, config);
  }

  static async customPrompt(
    promptType: string,
    text: string,
    customPrompt?: string,
    config?: Partial<GeminiConfig>
  ): Promise<string> {
    if (customPrompt) {
      return this.runPrompt(customPrompt, text, config);
    }

    switch (promptType) {
      case "expand":
        return this.expand(text, config);
      case "summarize":
        return this.summarize(text, config);
      case "improve":
        return this.improve(text, config);
      case "clarify":
        return this.clarify(text, config);
      case "translate":
        return this.translate(text, "Spanish", config);
      case "brainstorm":
        return this.brainstorm(text, config);
      default:
        throw new Error(`Unknown prompt type: ${promptType}`);
    }
  }
}
