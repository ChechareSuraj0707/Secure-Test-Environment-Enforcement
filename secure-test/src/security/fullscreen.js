import { logEvent } from "../logger/logger";
import { createEvent } from "../logger/eventSchema";

export const enableFullscreen = async (attemptId) => {

  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
  }

  document.addEventListener("fullscreenchange", () => {

    if (!document.fullscreenElement) {

      log("EXIT_FULLSCREEN", attemptId);
    }
  });
};

const log = (type, attemptId) => {

  logEvent(
    createEvent({ type, attemptId })
  );
};
