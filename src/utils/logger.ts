/* eslint-disable @typescript-eslint/no-explicit-any */
import pino from "pino";

export enum LogLevel {
  TRACE = "trace",
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  FATAL = "fatal",
}

export enum LogCategory {
  API = "api",
  PERFORMANCE = "performance",
  ERROR = "error",
  SYSTEM = "system",
}

export interface LogContext {
  category: LogCategory;
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: any;
}

const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  base: {
    env: process.env.NODE_ENV,
  },
});

const createLogEntry = (
  level: LogLevel,
  message: string,
  context: LogContext,
) => {
  return {
    level,
    message,
    ...context,
    timestamp: new Date().toISOString(),
  };
};

export const log = {
  trace: async (message: string, context: LogContext) => {
    logger.trace(createLogEntry(LogLevel.TRACE, message, context));
  },
  debug: async (message: string, context: LogContext) => {
    logger.debug(createLogEntry(LogLevel.DEBUG, message, context));
  },
  info: async (message: string, context: LogContext) => {
    logger.info(createLogEntry(LogLevel.INFO, message, context));
  },
  warn: async (message: string, context: LogContext) => {
    logger.warn(createLogEntry(LogLevel.WARN, message, context));
  },
  error: async (message: string, context: LogContext & { error?: Error }) => {
    const errorContext = context.error
      ? {
          ...context,
          error: {
            message: context.error.message,
            stack: context.error.stack,
            name: context.error.name,
          },
        }
      : context;
    logger.error(createLogEntry(LogLevel.ERROR, message, errorContext));
  },
  fatal: async (message: string, context: LogContext) => {
    logger.fatal(createLogEntry(LogLevel.FATAL, message, context));
  },
};

export const logApiCall = async (
  url: string,
  method: string,
  status: number,
  duration: number,
  error?: Error,
) => {
  const context: LogContext = {
    category: LogCategory.API,
    component: "api",
    action: method,
    url,
    status,
    duration,
  };

  if (error) {
    log.error(`API call failed: ${method} ${url}`, { ...context, error });
  } else {
    log.info(`API call completed: ${method} ${url}`, context);
  }
};

export const logPerformance = async (
  metric: string,
  value: number,
  component: string,
  details?: Record<string, any>,
) => {
  log.info(`Performance metric: ${metric}`, {
    category: LogCategory.PERFORMANCE,
    component,
    metric,
    value,
    ...details,
  });
};

export const logError = async (
  message: string,
  error: Error,
  component: string,
  context?: Record<string, any>,
) => {
  log.error(message, {
    category: LogCategory.ERROR,
    component,
    ...context,
    error,
  });
};
