import axios from "axios";
import { getLogs, clearLogs } from "../logger/storage";

const API = "https://example.com/api/logs"; // demo

export const syncLogs = async () => {

  const logs = getLogs();

  if (!logs.length) return;

  try {

    await axios.post(API, {
      logs
    });

    clearLogs();

  } catch (err) {
    console.log("Sync failed, retry later");
  }
};
