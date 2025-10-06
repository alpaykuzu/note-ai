import React, { useState } from "react";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  currentEmoji?: string;
}

const EMOJI_CATEGORIES = {
  "Frequently Used": ["📄", "📝", "✅", "💡", "🎯", "📌", "⭐", "🔥"],
  Symbols: ["✨", "💫", "🌟", "⚡", "🎨", "🎭", "🎪", "🎬"],
  Objects: ["📚", "📖", "📋", "📊", "📈", "💼", "🗂️", "📁"],
  Nature: ["🌸", "🌺", "🌻", "🌷", "🌹", "🍀", "🌿", "🌲"],
  Food: ["🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐"],
  Activities: ["⚽", "🏀", "🎮", "🎯", "🎲", "🎸", "🎹", "🎤"],
  Travel: ["✈️", "🚀", "🚁", "🚂", "🚗", "🏖️", "🏔️", "🗺️"],
  Faces: ["😀", "😊", "😍", "🤔", "😎", "🥳", "😴", "🤗"],
};

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onSelect,
  currentEmoji,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="group flex items-center justify-center w-20 h-20 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {currentEmoji ? (
          <span className="text-5xl">{currentEmoji}</span>
        ) : (
          <Smile className="w-8 h-8 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
        )}
      </button>

      {showPicker && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPicker(false)}
          />
          <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 z-50 w-80 max-h-96 overflow-y-auto animate-scale-in">
            {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
              <div key={category} className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  {category}
                </h4>
                <div className="grid grid-cols-8 gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        onSelect(emoji);
                        setShowPicker(false);
                      }}
                      className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
