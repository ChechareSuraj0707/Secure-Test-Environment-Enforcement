import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { v4 as uuid } from "uuid";

import { initSecurity } from "./security/enforcer";
import { trackFocus } from "./security/focusTracker";
import { enableFullscreen } from "./security/fullscreen";
import { syncLogs } from "./services/syncService";

import "react-toastify/dist/ReactToastify.css";

export default function App() {

  const attemptId = uuid();

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

  alert("Test submitted. Logs are now locked.");
};

  return (
    <div className="p-6">

      <ToastContainer />

      <h1 className="text-2xl font-bold mb-4">
        Secure Test Environment
      </h1>

      <textarea
        className="border w-full p-3 h-40"
        placeholder="Type your answer here..."
      />

 {/* ✅ SUBMIT BUTTON */}
    <button
      onClick={handleSubmit}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Submit Test
    </button>

    </div>
  );
}
