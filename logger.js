import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize, errors, printf } = format;

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    
    // Add metadata if exists
    if (Object.keys(metadata).length > 0) {
      msg += ` | ${JSON.stringify(metadata)}`;
    }
    
    return msg;
  })
);

// Custom format for file logging
const fileLogFormat = format.combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }), // Capture stack traces
  json()
);

// Create a Winston logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  format: fileLogFormat,
  transports: [
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  // Prevent logger from exiting on error
  exitOnError: false,
});

// Add exception handling
logger.exceptions.handle(
  new transports.File({ filename: 'logs/exceptions.log' })
);

// Add rejection handling (for unhandled promise rejections)
logger.rejections.handle(
  new transports.File({ filename: 'logs/rejections.log' })
);

// Add Console transport based on environment
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: consoleLogFormat,
    level: 'debug',
  }));
}

export default logger;
