/**
 * Logger class for MCP server
 */
class Logger {
    logToStderr: boolean;
    prefix: any;
    constructor(options: { logToStderr?: boolean, prefix?: string } = {}) {
      this.logToStderr = options.logToStderr !== false; 
      this.prefix = options.prefix || "[MCP]"; 
    }
  
    log(message: any, ...args: any[]) {
      this._write("log", message, ...args);
    }
  
    info(message: any, ...args: any[]) {
      this._write("info", message, ...args);
    }
  
    warn(message: any, ...args: any[]) {
      this._write("warn", message, ...args);
    }
  
    error(message: any, ...args: any[]) {
      this._write("error", message, ...args);
    }
  
    _write(level: any, message: any, ...args: any[]) {
      const timestamp = new Date().toISOString();
      const formattedMessage = `${this.prefix} [${level.toUpperCase()}] ${timestamp} - ${message}`;
      
      if (this.logToStderr) {
        console.error(formattedMessage, ...args);
      } else {
        console.log(formattedMessage, ...args); 
      }
    }
  }
  
  export const logger = new Logger();