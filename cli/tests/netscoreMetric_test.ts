import { NetScore } from '../lib/models/NetScore';
import { SystemLogger } from '../lib/utilities/logger';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables and initialize the logger
dotenv.config();
SystemLogger.initialize();

describe('End-to-End Test for NetScore Calculation', () => {
  const mockURL = 'https://github.com/owner/repo';  // Mock URL

  beforeEach(() => {
    // Clear any previous logs or mock data before running the test
    jest.resetModules();
    if (fs.existsSync(process.env.LOG_FILE!)) {
      fs.unlinkSync(process.env.LOG_FILE!); // Remove old log file if exists
    }
  });

  test('should correctly calculate NetScore for valid inputs', async () => {
    // Define valid inputs based on Sarah's formula
    const scores = [1, 0.9, 0.8, 0.7, 0.6]; // License, RM, other, BF, Correctness
    const weights = [0.4, 0.2, 0.2, 0.2, 0.2]; // Weights for RM, BF, C, and RM again
    const latencies = [0.01, 0.02, 0.03, 0.04, 0.05]; // Latency values for each metric

    // Create a new instance of the NetScore class with the inputs
    const netScore = new NetScore(mockURL, scores, weights, latencies);

    // Verify the calculated NetScore (expected result is based on Sarah’s formula)
    const expectedScore = 1 * (0.4 * 0.9 + 0.2 * 0.7 + 0.2 * 0.6 + 0.2 * 0.9) * 0.8;
    expect(netScore.score).toBeCloseTo(expectedScore, 3); // Allowing for rounding differences

    // Verify the calculated latency (sum of latencies)
    const expectedLatency = latencies.reduce((acc, curr) => acc + curr, 0).toFixed(3);
    expect(netScore.getLatency()).toBe(parseFloat(expectedLatency));

    // Check the system logs for any logged messages
    const logFilePath = process.env.LOG_FILE;
    if (logFilePath && fs.existsSync(logFilePath)) {
      await new Promise<void>((resolve) => setTimeout(resolve, 200)); // Small delay to allow logs to be written
      const logContent = fs.readFileSync(logFilePath, 'utf8');
      expect(logContent).toContain('License initialized with URL');
    }
  });

  test('should handle a scenario where the license score is 0', async () => {
    // Define inputs where the license is 0 (expected NetScore should be 0)
    const scores = [0, 0.9, 0.8, 0.7, 0.6]; // License is 0
    const weights = [0.4, 0.2, 0.2, 0.2, 0.2]; // Weights for RM, BF, C, and RM again
    const latencies = [0.01, 0.02, 0.03, 0.04, 0.05]; // Latency values for each metric

    // Create a new instance of the NetScore class with the inputs
    const netScore = new NetScore(mockURL, scores, weights, latencies);

    // Verify the calculated NetScore (since license is 0, the expected result is 0)
    expect(netScore.score).toBe(0);

    // Verify the calculated latency (sum of latencies)
    const expectedLatency = latencies.reduce((acc, curr) => acc + curr, 0).toFixed(3);
    expect(netScore.getLatency()).toBe(parseFloat(expectedLatency));

    // Check the system logs for any logged messages
    const logFilePath = process.env.LOG_FILE;
    if (logFilePath && fs.existsSync(logFilePath)) {
      await new Promise<void>((resolve) => setTimeout(resolve, 200)); // Small delay to allow logs to be written
      const logContent = fs.readFileSync(logFilePath, 'utf8');
      expect(logContent).toContain('License initialized with URL');
    }
  });
});
