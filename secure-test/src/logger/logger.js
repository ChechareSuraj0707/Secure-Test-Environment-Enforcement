import { saveLog } from "./storage";

export const logEvent = (event) => {
  saveLog(event);
};
