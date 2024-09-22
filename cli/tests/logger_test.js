"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const logger_1 = require("../lib/utilities/logger");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// This imports the logger class, file system (`fs`) module, and path manipulation (`path`) module. 
// The `SystemLogger` is the logging utility you're testing.
describe('SystemLogger', () => {
    // Setting up paths for the log directory and log file used during testing
    const testLogDir = path.join(__dirname, 'test_logs');
    const testLogFile = path.join(testLogDir, 'test.log');
    beforeEach(() => {
        // This function runs before each test case.
        // It resets environment variables and removes any log files or directories created by previous tests.
        // Reset LOG_FILE and LOG_LEVEL environment variables
        delete process.env.LOG_FILE;
        delete process.env.LOG_LEVEL;
        // Remove the test log file if it exists
        if (fs.existsSync(testLogFile)) {
            fs.unlinkSync(testLogFile);
        }
        // Remove the test log directory if it exists
        if (fs.existsSync(testLogDir)) {
            fs.rmdirSync(testLogDir);
        }
    });
    afterEach(() => {
        // This function runs after each test case.
        // It performs similar cleanup to `beforeEach` to ensure the test environment is clean after every test.
        // Remove the test log file if it exists
        if (fs.existsSync(testLogFile)) {
            fs.unlinkSync(testLogFile);
        }
        // Remove the test log directory if it exists
        if (fs.existsSync(testLogDir)) {
            fs.rmdirSync(testLogDir);
        }
    });
    test('initialize creates log directory if it does not exist', () => {
        // Test that the logger creates the log directory if it does not exist
        // Set the LOG_FILE environment variable to the test log file path
        process.env.LOG_FILE = testLogFile;
        // Initialize the logger
        logger_1.SystemLogger.initialize();
        // Check if the log directory is created
        expect(fs.existsSync(testLogDir)).toBe(true);
    });
    test('logs info message when log level is INFO', done => {
        // Test that an info message is logged when log level is set to INFO
        // Set environment variables for LOG_FILE and LOG_LEVEL
        process.env.LOG_FILE = testLogFile;
        process.env.LOG_LEVEL = '1'; // INFO level
        // Initialize the logger
        logger_1.SystemLogger.initialize();
        const testMessage = 'Test info message'; // The message to log
        // Log the info message
        logger_1.SystemLogger.info(testMessage);
        // Use a timeout to give the logger time to write to the file
        setTimeout(() => {
            // Read the contents of the log file
            const logContent = fs.readFileSync(testLogFile, 'utf8');
            // Check that the log contains the info message
            expect(logContent).toContain('[INFO]: ' + testMessage);
            done();
        }, 100);
    });
    test('logs debug message when log level is DEBUG', done => {
        // Test that a debug message is logged when log level is set to DEBUG
        process.env.LOG_FILE = testLogFile;
        process.env.LOG_LEVEL = '2'; // DEBUG level
        logger_1.SystemLogger.initialize();
        const testMessage = 'Test debug message'; // The message to log
        logger_1.SystemLogger.debug(testMessage);
        setTimeout(() => {
            const logContent = fs.readFileSync(testLogFile, 'utf8');
            expect(logContent).toContain('[DEBUG]: ' + testMessage);
            done();
        }, 100);
    });
    test('logs error message at all non-OFF log levels', done => {
        // Test that an error message is logged regardless of the log level (INFO or DEBUG)
        process.env.LOG_FILE = testLogFile;
        process.env.LOG_LEVEL = '1'; // INFO level
        logger_1.SystemLogger.initialize();
        const testMessage = 'Test error message'; // The message to log
        logger_1.SystemLogger.error(testMessage);
        setTimeout(() => {
            const logContent = fs.readFileSync(testLogFile, 'utf8');
            expect(logContent).toContain('[ERROR]: ' + testMessage);
            done();
        }, 100);
    });
    test('does not log when log level is OFF', done => {
        // Test that no messages are logged when the log level is OFF
        process.env.LOG_FILE = testLogFile;
        process.env.LOG_LEVEL = '0'; // OFF level
        logger_1.SystemLogger.initialize();
        // Log various messages
        logger_1.SystemLogger.info('This should not be logged');
        logger_1.SystemLogger.debug('This should not be logged either');
        logger_1.SystemLogger.error('This should not be logged as well');
        // Check that the log file doesn't exist, meaning nothing was logged
        setTimeout(() => {
            expect(fs.existsSync(testLogFile)).toBe(false);
            done();
        }, 100);
    });
    test('logs to console', () => {
        // Test that the logger outputs messages to the console
        const consoleSpy = jest.spyOn(console, 'log'); // Spy on console.log
        process.env.LOG_LEVEL = '2'; // DEBUG level
        logger_1.SystemLogger.initialize();
        // Log an info message
        logger_1.SystemLogger.info('Console log test');
        // Check that console.log was called with the expected message
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO]: Console log test'));
        // Restore the original console.log function
        consoleSpy.mockRestore();
    });
    test('handles missing LOG_FILE environment variable', () => {
        // Test that the logger can handle when LOG_FILE is not set
        process.env.LOG_LEVEL = '2'; // DEBUG level
        logger_1.SystemLogger.initialize();
        // Check that logging info messages does not throw errors
        expect(() => {
            logger_1.SystemLogger.info('This should not throw an error');
        }).not.toThrow();
    });
    test('handles invalid LOG_LEVEL environment variable', () => {
        // Test that the logger can handle invalid log level values
        process.env.LOG_FILE = testLogFile;
        process.env.LOG_LEVEL = 'invalid'; // Invalid log level
        logger_1.SystemLogger.initialize();
        // Check that no messages are logged when the log level is invalid
        logger_1.SystemLogger.info('This should not be logged');
        logger_1.SystemLogger.debug('This should not be logged either');
        expect(fs.existsSync(testLogFile)).toBe(false);
    });
});
