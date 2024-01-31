// logging.server.ts
import pino from "pino";

/**
 * Logging service config
 */
const logger = pino({
  level: "info", // Sets the logging level (e.g., 'info', 'warn', 'error')
});

export default logger;
