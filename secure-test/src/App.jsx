import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import AuditPanel from "./components/AuditPanel";

import { initSecurity } from "./security/enforcer";
import { trackFocus } from "./security/focusTracker";
import { enableFullscreen } from "./security/fullscreen";
import { syncLogs } from "./services/syncService";

import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const attemptId = uuid();
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    // Unlock when new test starts
    localStorage.removeItem("LOCKED");

    initSecurity(attemptId);
    trackFocus(attemptId);
    enableFullscreen(attemptId);

    const timer = setInterval(syncLogs, 10000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    // Lock logs
    localStorage.setItem("LOCKED", "true");

    // Send logs to server
    await syncLogs();

    // alert("Test submitted. Logs are now locked.");
    toast.success("Test submitted. Logs are now locked.");
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* LEFT SIDE - TEST AREA */}
      <div className="flex-1 flex flex-col p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Secure Test Environment</h1>

        <textarea
          className="flex-1 border p-3 mb-4 resize-none"
          placeholder="Type your answer here..."
        />

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showLogs ? "Hide Logs" : "Show Logs"}
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* RIGHT SIDE - AUDIT PANEL - Show only when button is clicked */}
      {showLogs && (
        <div
          style={{
            marginLeft: "250px",
            width: "380px",
            height: "100%",
            backgroundColor: "#1a1a1a",
            borderLeft: "1px solid #333",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AuditPanel />
        </div>
      )}
    </div>
  );
}
