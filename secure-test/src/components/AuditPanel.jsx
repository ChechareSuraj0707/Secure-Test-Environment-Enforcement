import { useEffect, useState } from "react";

export default function AuditPanel() {
  const [logs, setLogs] = useState([]);
  const [locked, setLocked] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const load = () => {
      const data = JSON.parse(localStorage.getItem("secure_test_logs")) || [];

      setLogs(data);
      setLocked(!!localStorage.getItem("LOCKED"));
    };

    load();

    const timer = setInterval(load, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div
      className="flex flex-col text-green-400 text-xs"
      style={{
        border: "2px solid #22c55e",
        borderRadius: "8px",
        backgroundColor: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
      }}
    >
      {/* HEADER */}
      <div className="bg-black flex-shrink-0">
        <div className="p-3">
          <div className="font-bold text-sm">📋 Audit Panel</div>
          <div>Total Logs: {logs.length}</div>
          <div>Status: {locked ? "🔒 LOCKED" : "🟢 ACTIVE"}</div>
          <h4
            className="flex flex-col text-green-400 text-xs"
            style={{
              border: "2px solid #22c55e",
              borderRadius: "8px",
              backgroundColor: "#0a0a0a",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              height: "100%",
            }}
          ></h4>
        </div>
        <div className="h-px bg-green-700"></div>
        <div className="h-px bg-green-500"></div>
      </div>

      {/* SCROLLABLE BODY - Show all entries */}
      <div
        className="overflow-y-auto p-3 space-y-2"
        style={{
          maxHeight: "400px",
          minHeight: 0,
          flex: "none",
        }}
      >
        {logs.length === 0 && (
          <div className="text-yellow-400">⏳ No logs yet...</div>
        )}

        {[...logs].reverse().map((log, index) => (
          <div
            key={log.id}
            className="border border-green-700 p-2 rounded flex-shrink-0 cursor-pointer hover:border-green-400"
            onClick={() => toggleExpand(log.id)}
            style={{
              backgroundColor:
                expandedId === log.id ? "#1a2e1a" : "transparent",
            }}
          >
            {/* COLLAPSED VIEW */}
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold">
                  #{logs.length - index} {log.type}
                </div>
                <div className="text-gray-400">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <span className="text-yellow-400">
                {expandedId === log.id ? "▼" : "▶"}
              </span>
            </div>

            {/* EXPANDED VIEW */}
            {expandedId === log.id && (
              <div className="mt-2 pt-2 border-t border-green-700 text-gray-300 text-xs space-y-1">
                <div>
                  <b className="text-green-400">Event ID:</b>
                  <br />
                  <code className="text-yellow-300 break-all">{log.id}</code>
                </div>
                <div>
                  <b className="text-green-400">Attempt ID:</b>
                  <br />
                  <code className="text-yellow-300 break-all">
                    {log.attemptId}
                  </code>
                </div>
                <div>
                  <b className="text-green-400">Full Timestamp:</b>
                  <br />
                  <code className="text-yellow-300">{log.timestamp}</code>
                </div>
                <div>
                  <b className="text-green-400">Document Focus:</b>
                  <span
                    className={
                      log.metadata?.focus ? " text-green-400" : " text-red-400"
                    }
                  >
                    {String(log.metadata?.focus)}
                  </span>
                </div>
                <div>
                  <b className="text-green-400">User Agent:</b>
                  <br />
                  <code className="text-yellow-300 text-xs break-all">
                    {log.metadata?.userAgent?.substring(0, 50)}...
                  </code>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="p-2 border-t border-green-500 bg-black text-xs text-gray-400 flex-shrink-0">
        {locked ? (
          <div className="text-red-400">
            ⚠️ Test submitted - logs are immutable
          </div>
        ) : (
          <div className="text-green-400">✓ Actively recording events</div>
        )}
      </div>
    </div>
  );
}
