import { useState } from "react";
import { AIProvider } from "./context/AIContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { PageTree } from "./components/PageTree";
import { PageEditor } from "./components/PageEditor";
import { SettingsModal } from "./components/SettingsModal";
import { Settings, Menu, X, Moon, Sun } from "lucide-react";
import { NotesProvider } from "./context/NotesContext";

function AppContent() {
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const { theme, toggleTheme } = useTheme();

  return (
    <NotesProvider>
      <AIProvider>
        <div className="h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
          <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {showSidebar ? (
                  <X className="w-5 h-5 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 dark:text-gray-300" />
                )}
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                NotionAI
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all hover:scale-105"
                title={
                  theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all hover:scale-105"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {showSidebar && (
              <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex-shrink-0 overflow-hidden transition-colors">
                <PageTree />
              </aside>
            )}

            <main className="flex-1 overflow-hidden">
              <PageEditor />
            </main>
          </div>

          {showSettings && (
            <SettingsModal onClose={() => setShowSettings(false)} />
          )}
        </div>
      </AIProvider>
    </NotesProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
