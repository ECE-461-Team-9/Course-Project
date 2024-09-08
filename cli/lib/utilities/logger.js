"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemLogger = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["OFF"] = 0] = "OFF";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 2] = "DEBUG";
})(LogLevel || (LogLevel = {}));
/**
 * A system-wide logging utility class.
 * This class provides methods for initializing the logger and writing log messages.
 */
class SystemLogger {
    /**
     * Initializes the logging system.
     * Reads environment variables to set up logging configuration.
     */
    static initialize() {
        this.logFile = process.env.LOG_FILE;
        this.logLevel = this.parseLogLevel(process.env.LOG_LEVEL);
        if (this.logFile) {
            // Ensure the directory exists
            const dir = path.dirname(this.logFile);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        }
    }
    /**
     * Parses the log level from environment variable.
     * Defaults to OFF if the value is missing or invalid.
     */
    static parseLogLevel(level) {
        const parsedLevel = parseInt(level || '0');
        return isNaN(parsedLevel) ? LogLevel.OFF : parsedLevel;
    }
    /**
     * Logs an informational message.
     * This will only be logged if the log level is set to INFO or higher.
     * @param message The string message to be logged
     */
    static info(message) {
        if (this.logLevel >= LogLevel.INFO) {
            this.log('INFO', message);
        }
    }
    /**
     * Logs a debug message.
     * This will only be logged if the log level is set to DEBUG.
     * @param message The string message to be logged
     */
    static debug(message) {
        if (this.logLevel >= LogLevel.DEBUG) {
            this.log('DEBUG', message);
        }
    }
    /**
     * Logs an error message.
     * This will be logged at all non-OFF log levels.
     * @param message The string message to be logged
     */
    static error(message) {
        if (this.logLevel > LogLevel.OFF) {
            this.log('ERROR', message);
        }
    }
    /**
     * Internal method to write log messages.
     * @param level The log level of the message
     * @param message The message to be logged
     */
    static log(level, message) {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} [${level}]: ${message}\n`;
        console.log(logMessage.trim()); // Log to console
        if (this.logFile) {
            fs.appendFile(this.logFile, logMessage, (err) => {
                if (err)
                    console.error(`Failed to write to log file: ${err}`);
            });
        }
    }
}
exports.SystemLogger = SystemLogger;
SystemLogger.logLevel = LogLevel.OFF;
