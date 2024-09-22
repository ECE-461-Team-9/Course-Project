// imports
import { Metric } from './Metric';
import { SystemLogger } from '../utilities/logger';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
SystemLogger.initialize();

export class NetScore extends Metric {
    private latency: number;

    constructor(URL: string, scores: number[], weights: number[], latencies: number[]) {
        SystemLogger.info(`License initialized with URL: ${URL}`);
        super(URL);
        this.score = 0; // Initialize score with a default number value

        // Ensure the scores, weights, and latencies arrays have the correct length (5 elements each)
        if (scores.length !== 5 || weights.length !== 5 || latencies.length !== 5) {
            throw new Error("Scores, weights, and latencies arrays must have exactly 5 elements each.");
        }

        // Calculate the score using the scores and weights
        this.score = scores[2] * (scores[0] * weights[0] + scores[1] * weights[1] + scores[3] * weights[3] + scores[4] * weights[4]);
        
        // Calculate the total latency and round to the third decimal place
        this.latency = parseFloat(latencies.reduce((acc, value) => acc + value, 0).toFixed(3));
    }

    public getLatency(): number {
        return this.latency;
    }
}
