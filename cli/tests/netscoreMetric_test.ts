import { NetScore } from '../lib/models/NetScore';

describe('NetScore', () => {
    let netScore: NetScore;

    // Test case: Should return maximum score when all scores are 1
    test('should return maximum score when all scores are 1', () => {
        const scores = [1.0, 1.0, 1.0, 1.0, 1.0]; // License and other scores are 1
        const weights = [0.4, 0.2, 0.2, 0.2, 0.0]; // Weights as per Sarah's priorities
        const latencies = [100, 150, 200, 250, 300]; // Example latencies (5 elements)

        netScore = new NetScore('https://github.com/owner/repo', scores, weights, latencies);

        expect(netScore.score).toBe(1.0); // Maximum possible score
    });

    // Test case: Should return minimum score when license score is 0
    test('should return minimum score when license score is 0', () => {
        const scores = [0, 1.0, 1.0, 1.0, 1.0]; // License score is 0
        const weights = [0.4, 0.2, 0.2, 0.2, 0.0]; // Weights as per Sarah's priorities
        const latencies = [100, 150, 200, 250, 300]; // Example latencies (5 elements)

        netScore = new NetScore('https://github.com/owner/repo', scores, weights, latencies);

        expect(netScore.score).toBe(0); // Minimum possible score because license score is 0
    });

    // Test case: Should calculate latency correctly
    test('should calculate latency correctly', () => {
        const scores = [1.0, 1.0, 1.0, 1.0, 1.0]; // Example scores
        const weights = [0.4, 0.2, 0.2, 0.2, 0.0]; // Example weights
        const latencies = [100, 150, 200, 250, 300]; // Latency values (5 elements)

        netScore = new NetScore('https://github.com/owner/repo', scores, weights, latencies);

        expect(netScore.getLatency()).toBe(1000); // Total latency is the sum of latencies
    });

    // Test case: Should return a lower score when "other" score is low
    test('should return a lower score when "other" score is low', () => {
        const scores = [1.0, 1.0, 0.5, 1.0, 1.0]; // "Other" score is 0.5
        const weights = [0.4, 0.2, 0.2, 0.2, 0.0]; // Weights as per Sarah's priorities
        const latencies = [100, 150, 200, 250, 300]; // Example latencies (5 elements)

        netScore = new NetScore('https://github.com/owner/repo', scores, weights, latencies);

        expect(netScore.score).toBeLessThan(1.0); // Expect a score lower than 1.0 due to "other" score being 0.5
    });
});
