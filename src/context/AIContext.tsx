import React, { createContext, useContext, useState } from "react";
import { GeminiService } from "../services/gemini";
import { StorageService } from "../services/storage";

interface AIContextType {
  isProcessing: boolean;
  error: string | null;
  apiKey: string | null;
  setApiKey: (key: string) => void;
  processBlock: (
    blockId: string,
    text: string,
    promptType: string,
    customPrompt?: string
  ) => Promise<string>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKeyState] = useState<string | null>(
    StorageService.getGeminiApiKey()
  );

  const setApiKey = (key: string) => {
    StorageService.setGeminiApiKey(key);
    setApiKeyState(key);
  };

  const processBlock = async (
    _blockId: string,
    text: string,
    promptType: string,
    customPrompt?: string
  ): Promise<string> => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await GeminiService.customPrompt(
        promptType,
        text,
        customPrompt
      );
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AIContext.Provider
      value={{
        isProcessing,
        error,
        apiKey,
        setApiKey,
        processBlock,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within AIProvider");
  }
  return context;
};
