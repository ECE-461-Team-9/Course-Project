"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
function main() {
    // Initialize the logger
    logger_1.SystemLogger.initialize();
    // Log some messages to test
    logger_1.SystemLogger.info('Application has started');
    console.log('Hello, World!');
    logger_1.SystemLogger.debug('This is a debug message');
}
main();
