const KEY = "secure_test_logs";

export const saveLog = (event) => {

  // ❌ Stop saving after submit
  if (localStorage.getItem("LOCKED")) {
    return;
  }

  const logs = getLogs();

  logs.push(event);

  localStorage.setItem(KEY, JSON.stringify(logs));
};

export const getLogs = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const clearLogs = () => {
  localStorage.removeItem(KEY);
};
