export const serviceconnectionLogger = {
  log: (...args: any[]) => console.log("[Service Connection]", ...args),
  error: (...args: any[]) => console.error("[Service Connection]", ...args),
  warn: (...args: any[]) => console.warn("[Service Connection]", ...args),
  info: (...args: any[]) => console.info("[Service Connection]", ...args),
};