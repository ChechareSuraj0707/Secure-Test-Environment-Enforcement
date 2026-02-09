import { toast } from "react-toastify";
import { logEvent } from "../logger/logger";
import { createEvent } from "../logger/eventSchema";

export const initSecurity = (attemptId) => {

  // Disable right click
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    warn("Right click blocked");

    log("RIGHT_CLICK", attemptId);
  });

  // Keyboard block
  document.addEventListener("keydown", (e) => {

    const isMac = navigator.platform.includes("Mac");

    const ctrl = isMac ? e.metaKey : e.ctrlKey;

    if (ctrl && ["c", "v", "x"].includes(e.key.toLowerCase())) {

      e.preventDefault();

      const map = {
        c: "COPY",
        v: "PASTE",
        x: "CUT"
      };

      warn(`${map[e.key]} blocked`);

      log(map[e.key], attemptId);
    }
  });

  // Disable selection
  document.body.style.userSelect = "none";
};


const warn = (msg) => {
  toast.warning(msg, {
    position: "top-center",
    autoClose: 1500,
  });
};

const log = (type, attemptId) => {

  const event = createEvent({
    type,
    attemptId
  });

  logEvent(event);
};
