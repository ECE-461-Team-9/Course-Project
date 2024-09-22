// Imports
import { SystemLogger } from '../lib/utilities/logger';
import * as fs from 'fs';
import * as path from 'path';

describe('SystemLogger', () => {
  const testLogDir = path.join(__dirname, 'test_logs');
  const testLogFile = path.join(testLogDir, 'test.log');

  beforeEach(() => {
    delete process.env.LOG_FILE;
    delete process.env.LOG_LEVEL;

    if (fs.existsSync(testLogFile)) {
      fs.unlinkSync(testLogFile);
    }

    if (fs.existsSync(testLogDir)) {
      fs.rmdirSync(testLogDir);
    }
  });

  afterEach(() => {
    if (fs.existsSync(testLogFile)) {
      fs.unlinkSync(testLogFile);
    }

    if (fs.existsSync(testLogDir)) {
      fs.rmdirSync(testLogDir);
    }
  });

  test('initialize creates log directory if it does not exist', () => {
    process.env.LOG_FILE = testLogFile;
    SystemLogger.initialize();
    expect(fs.existsSync(testLogDir)).toBe(true);
  });

  test('logs info message when log level is INFO', async () => {
    process.env.LOG_FILE = testLogFile;
    process.env.LOG_LEVEL = '1'; // INFO level
    SystemLogger.initialize();
    
    const testMessage = 'Test info message';
    SystemLogger.info(testMessage);
    
    await new Promise<void>(resolve => {
      setTimeout(() => {
        const logContent = fs.readFileSync(testLogFile, 'utf8');
        expect(logContent).toContain('[INFO]: ' + testMessage);
        resolve();
      }, 100);
    });
  });

  test('logs debug message when log level is DEBUG', async () => {
    process.env.LOG_FILE = testLogFile;
    process.env.LOG_LEVEL = '2'; // DEBUG level
    SystemLogger.initialize();
    
    const testMessage = 'Test debug message';
    SystemLogger.debug(testMessage);
    
    await new Promise<void>(resolve => {
      setTimeout(() => {
        const logContent = fs.readFileSync(testLogFile, 'utf8');
        expect(logContent).toContain('[DEBUG]: ' + testMessage);
        resolve();
      }, 100);
    });
  });

  test('logs error message at all non-OFF log levels', async () => {
    process.env.LOG_FILE = testLogFile;
    process.env.LOG_LEVEL = '1';  // INFO level
    SystemLogger.initialize();
    
    const testMessage = 'Test error message';
    SystemLogger.error(testMessage);
    
    await new Promise<void>(resolve => {
      setTimeout(() => {
        const logContent = fs.readFileSync(testLogFile, 'utf8');
        expect(logContent).toContain('[ERROR]: ' + testMessage);
        resolve();
      }, 100);
    });
  });

  test('does not log when log level is OFF', async () => {
    process.env.LOG_FILE = testLogFile;
    process.env.LOG_LEVEL = '0'; // OFF level
    SystemLogger.initialize();
    
    SystemLogger.info('This should not be logged');
    SystemLogger.debug('This should not be logged either');
    SystemLogger.error('This should not be logged as well');

    await new Promise<void>(resolve => {
      setTimeout(() => {
        expect(fs.existsSync(testLogFile)).toBe(false);
        resolve();
      }, 100);
    });
  });

  test('logs to console', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    process.env.LOG_LEVEL = '2'; // DEBUG level
    SystemLogger.initialize();
    
    SystemLogger.info('Console log test');
    
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO]: Console log test'));
    consoleSpy.mockRestore();
  });

  test('handles missing LOG_FILE environment variable', () => {
    process.env.LOG_LEVEL = '2'; // DEBUG level
    SystemLogger.initialize();
    
    expect(() => {
      SystemLogger.info('This should not throw an error');
    }).not.toThrow();
  });

  test('handles invalid LOG_LEVEL environment variable', () => {
    process.env.LOG_FILE = testLogFile;
    process.env.LOG_LEVEL = 'invalid'; // Invalid log level
    SystemLogger.initialize();
    
    SystemLogger.info('This should not be logged');
    SystemLogger.debug('This should not be logged either');

    expect(fs.existsSync(testLogFile)).toBe(false);
  });

  // New test cases

  test('logger initializes with default OFF log level when LOG_LEVEL is not set', () => {
    delete process.env.LOG_LEVEL;

    SystemLogger.initialize();

    const consoleSpy = jest.spyOn(console, 'log');

    SystemLogger.info('This should not be logged');
    SystemLogger.debug('This should not be logged');
    SystemLogger.error('This should not be logged');

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  test('logger successfully logs messages of increasing severity', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    process.env.LOG_LEVEL = '2';
    SystemLogger.initialize();

    SystemLogger.info('Info message');
    SystemLogger.debug('Debug message');
    SystemLogger.error('Error message');

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO]: Info message'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[DEBUG]: Debug message'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR]: Error message'));

    const calls = consoleSpy.mock.calls;
    expect(calls[calls.length - 1][0]).toContain('[ERROR]: Error message');

    consoleSpy.mockRestore();
  });
})