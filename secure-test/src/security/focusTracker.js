import { logEvent } from "../logger/logger";
import { createEvent } from "../logger/eventSchema";

export const trackFocus = (attemptId) => {

  window.addEventListener("blur", () => {
    log("TAB_BLUR", attemptId);
  });

  window.addEventListener("focus", () => {
    log("TAB_FOCUS", attemptId);
  });

  document.addEventListener("visibilitychange", () => {

    if (document.hidden) {
      log("TAB_HIDDEN", attemptId);
    } else {
      log("TAB_VISIBLE", attemptId);
    }
  });
};

const log = (type, attemptId) => {

  const e = createEvent({
    type,
    attemptId
  });

  logEvent(e);
};
