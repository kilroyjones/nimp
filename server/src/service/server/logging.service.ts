// logging.server.ts
import pino from "pino";

// Configure Pino logger
const logger = pino({
  level: "info", // Sets the logging level (e.g., 'info', 'warn', 'error')
});

export default logger;
