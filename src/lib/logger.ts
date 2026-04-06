function isBrowser() {
  return typeof window !== "undefined";
}

class Logger {
  info(message: string, meta?: any) {
    if (process.env.NODE_ENV !== "production") {
      console.info(message, meta);
    } else {
      console.info(JSON.stringify({ level: "info", message, meta }));
    }
  }

  error(message: string, meta?: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error(message, meta);
    } else {
      console.error(JSON.stringify({ level: "error", message, meta }));
    }
  }

  warn(message: string, meta?: any) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(message, meta);
    } else {
      console.warn(JSON.stringify({ level: "warn", message, meta }));
    }
  }
}

export const logger = new Logger();
