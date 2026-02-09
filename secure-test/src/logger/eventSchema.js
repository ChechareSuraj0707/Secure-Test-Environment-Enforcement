export const createEvent = ({
  type,
  attemptId,
  questionId = null,
  meta = {}
}) => {
  return {
    id: crypto.randomUUID(),
    type,
    timestamp: new Date().toISOString(),
    attemptId,
    questionId,
    metadata: {
      userAgent: navigator.userAgent,
      focus: document.hasFocus(),
      ...meta
    }
  };
};
