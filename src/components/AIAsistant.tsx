import React, { useState } from "react";
import { useAI } from "../context/AIContext";
import { AI_PROMPT_TEMPLATES } from "../constants";
import { Sparkles, X, Loader2, AlertCircle } from "lucide-react";
import { useNotes } from "../context/NotesContext";

interface AIAssistantProps {
  blockId: string;
  text: string;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  blockId,
  text,
  onClose,
}) => {
  const { processBlock, isProcessing, error } = useAI();
  const { updateBlock } = useNotes();
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [result, setResult] = useState<string>("");

  const handleProcess = async () => {
    if (!selectedPrompt && !customPrompt) return;

    try {
      const promptToUse = customPrompt || selectedPrompt;
      const response = await processBlock(
        blockId,
        text,
        promptToUse,
        customPrompt || undefined
      );
      setResult(response);
    } catch (err) {
      console.error("AI processing error:", err);
    }
  };

  const handleApply = () => {
    if (result) {
      updateBlock(blockId, {
        content: { text: result },
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-semibold dark:text-gray-100">
              AI Assistant
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Action
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AI_PROMPT_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedPrompt(template.id);
                    setCustomPrompt("");
                  }}
                  className={`p-3 text-left border rounded-lg hover:border-primary-500 transition-all hover:scale-[1.02] ${
                    selectedPrompt === template.id
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  disabled={isProcessing}
                >
                  <div className="font-medium text-sm dark:text-gray-200">
                    {template.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Or Custom Prompt
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => {
                setCustomPrompt(e.target.value);
                if (e.target.value) setSelectedPrompt("");
              }}
              placeholder="Enter your custom instruction. Response will be direct without preambles."
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg p-3 text-sm transition-colors"
              rows={3}
              disabled={isProcessing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Original Text
            </label>
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm max-h-32 overflow-y-auto dark:text-gray-200">
              {text}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {result && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Result
              </label>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm max-h-48 overflow-y-auto whitespace-pre-wrap dark:text-gray-200">
                {result}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          {!result ? (
            <button
              onClick={handleProcess}
              disabled={isProcessing || (!selectedPrompt && !customPrompt)}
              className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all hover:scale-105"
            >
              {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
              {isProcessing ? "Processing..." : "Generate"}
            </button>
          ) : (
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all hover:scale-105"
            >
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
