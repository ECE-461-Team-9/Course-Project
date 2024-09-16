import * as fs from 'fs';
import * as readline from 'readline';
import { BusFactor } from './BusFactor';
import { RM } from './RM';
import { License } from './License';
import { NetScore } from './NetScore';
import { RampUp } from './RampUp';
import { Correctness } from './Correctness';

export class URLProcessor {
    private urlFile: string;
    private outputFile: string;

    constructor(urlFile: string, outputFile: string) {
        this.urlFile = urlFile;
        this.outputFile = outputFile;
    }

    public async processUrlsFromFile(): Promise<void> {
        try {
            if (!fs.existsSync(this.urlFile)) {
                throw new Error(`File at "${this.urlFile}" does not exist.`);
            }

            const fileStream = fs.createReadStream(this.urlFile);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            const output = fs.createWriteStream(this.outputFile);
            console.log(`Processing URLs from "${this.urlFile}"...`);

            for await (const line of rl) {
                const url = line.trim();
                const evaluationResults = this.evaluateUrl(url);
                output.write(JSON.stringify(evaluationResults) + '\n'); // NDJSON format
            }

            console.log(`Successfully processed URLs. Output written to "${this.outputFile}".`);
            output.end();

        } catch (error) {
            console.error('Error processing file');
            process.exit(1);
        }
    }

    private evaluateUrl(url: string): Record<string, any> {
        // BusFactor latency
        const busFactorStart = process.hrtime();
        const busFactor = new BusFactor(url).getScore();
        const busFactorEnd = process.hrtime(busFactorStart);
        const busFactor_latency = (busFactorEnd[0] * 1e9 + busFactorEnd[1]) / 1e9; // Convert to seconds
    
        // ResponsiveMaintainer (RM) latency
        const rmStart = process.hrtime();
        const responsiveMaintainer = new RM(url).getScore();
        const rmEnd = process.hrtime(rmStart);
        const rm_latency = (rmEnd[0] * 1e9 + rmEnd[1]) / 1e9; // Convert to seconds
    
        // License latency
        const licenseStart = process.hrtime();
        const license = new License(url).getScore();
        const licenseEnd = process.hrtime(licenseStart);
        const license_latency = (licenseEnd[0] * 1e9 + licenseEnd[1]) / 1e9; // Convert to seconds
    
        // RampUp latency
        const rampUpStart = process.hrtime();
        const rampUp = new RampUp(url).getScore();
        const rampUpEnd = process.hrtime(rampUpStart);
        const rampUp_latency = (rampUpEnd[0] * 1e9 + rampUpEnd[1]) / 1e9; // Convert to seconds
    
        // Correctness latency
        const correctnessStart = process.hrtime();
        const correctness = new Correctness(url).getScore();
        const correctnessEnd = process.hrtime(correctnessStart);
        const correctness_latency = (correctnessEnd[0] * 1e9 + correctnessEnd[1]) / 1e9; // Convert to seconds
    
        // NetScore calculation
        const args = new Net
        const netScore = new NetScore({
            const rampUp, 
            const busFactor, 
            correctness, 
            responsiveMaintainer, 
            license
        }).score;

        const netScore_Latency = busFactor_latency + rm_latency + license_latency + rampUp_latency + correctness_latency;
    
        return {
            URL: url,
            NetScore: netScore.toFixed(3),
            NetScore_Latency: netScore_Latency.toFixed(3),
            BusFactor: busFactor.toFixed(3),
            BusFactor_Latency: busFactor_latency.toFixed(3),
            ResponsiveMaintainer: rm.toFixed(3),
            ResponsiveMaintainer_Latency: rm_latency.toFixed(3),
            RampUp: rampUp.toFixed(3),
            RampUp_Latency: rampUp_latency.toFixed(3),
            Correctness: correctness.toFixed(3),
            Correctness_Latency: correctness_latency.toFixed(3),
            License: license.toFixed(3),
            License_Latency: license_latency.toFixed(3)
        };
    }
}

// Main function to handle command-line arguments and run the URLProcessor
async function main() {
    if (process.argv.length !== 4) {
        console.error('Usage: ts-node <script> <urlFile> <outputFile>');
        process.exit(1);
    }

    const [,, urlFile, outputFile] = process.argv;

    const urlProcessor = new URLProcessor(urlFile, outputFile);
    await urlProcessor.processUrlsFromFile();
}

main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
});
