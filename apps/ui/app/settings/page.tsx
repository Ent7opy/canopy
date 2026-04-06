"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [weeklyReminder, setWeeklyReminder] = useState(true);
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "checking" | "connected" | "error">("idle");
  const [connectionMessage, setConnectionMessage] = useState("");

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedDark = localStorage.getItem("theme") === "dark";
    setDarkMode(savedDark);
    const savedNotifications = localStorage.getItem("notifications") !== "false";
    setNotifications(savedNotifications);
    const savedWeekly = localStorage.getItem("weeklyReminder") !== "false";
    setWeeklyReminder(savedWeekly);
    const savedApiUrl = localStorage.getItem("api-url") || "";
    setApiUrl(savedApiUrl);
    const savedApiKey = localStorage.getItem("api-key") || "";
    setApiKey(savedApiKey);
  }, []);

  // Save dark/light mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      const html = document.documentElement;
      if (darkMode) {
        html.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        html.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [darkMode]);

  const saveSetting = (key: string, value: boolean) => {
    localStorage.setItem(key, value.toString());
  };

  const saveApiConfig = () => {
    localStorage.setItem("api-url", apiUrl.trim());
    localStorage.setItem("api-key", apiKey.trim());
  };

  const testConnection = async () => {
    if (!apiUrl.trim()) {
      setConnectionStatus("error");
      setConnectionMessage("Please enter API URL");
      return;
    }
    setConnectionStatus("checking");
    try {
      const url = apiUrl.trim().replace(/\/$/, "");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey.trim()) {
        headers["x-api-key"] = apiKey.trim();
      }
      const response = await fetch(`${url}/health`, { headers });
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus("connected");
        setConnectionMessage(`Connected (${data.status})`);
      } else {
        setConnectionStatus("error");
        setConnectionMessage(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setConnectionStatus("error");
      setConnectionMessage(error instanceof Error ? error.message : "Network error");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        ⚙️ Settings
      </h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Preferences
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    Dark mode
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Switch between light and dark theme
                  </p>
                </div>
                <button
                  onClick={() => {
                    setDarkMode(!darkMode);
                    saveSetting("theme", !darkMode);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? "bg-blue-600" : "bg-zinc-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    Notifications
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Browser notifications for daily check‑ins
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNotifications(!notifications);
                    saveSetting("notifications", !notifications);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? "bg-blue-600" : "bg-zinc-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    Weekly reminder
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Sunday evening review reminder
                  </p>
                </div>
                <button
                  onClick={() => {
                    setWeeklyReminder(!weeklyReminder);
                    saveSetting("weeklyReminder", !weeklyReminder);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    weeklyReminder ? "bg-blue-600" : "bg-zinc-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      weeklyReminder ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* API Configuration */}
          <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              🔌 API Configuration
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  API URL
                </label>
                <input
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  onBlur={saveApiConfig}
                  placeholder="https://your-api.railway.app"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  API Key (optional)
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onBlur={saveApiConfig}
                  placeholder="Leave empty if no authentication required"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    Connection Status
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {connectionStatus === "idle" && "Not checked"}
                    {connectionStatus === "checking" && "Checking..."}
                    {connectionStatus === "connected" && `✅ ${connectionMessage}`}
                    {connectionStatus === "error" && `❌ ${connectionMessage}`}
                  </p>
                </div>
                <button
                  onClick={testConnection}
                  disabled={connectionStatus === "checking"}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Test Connection
                </button>
              </div>
            </div>
            <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
              The dashboard will use the API for persistent storage (tasks, progress, reading list). If the API is unavailable, data will be stored locally in your browser.
            </p>
          </div>
        </div>
        <div className="space-y-8">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Data
            </h3>
            <button className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700">
              Export data (JSON)
            </button>
            <button className="mt-3 w-full rounded-lg border border-zinc-300 py-3 font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
              Import data
            </button>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              About
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Life Dashboard v0.1.0
              <br />
              Built with Next.js & Tailwind.
              <br />
              Data stored locally in your browser.
            </p>
            <a
              href="https://github.com/Ent7opy/life-dashboard"
              className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              View source on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}