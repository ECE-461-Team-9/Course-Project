import * as fs from 'fs';
import * as readline from 'readline';
import { BusFactor } from './BusFactor';
import { RM } from './RM';
import { License } from './License';
import { NetScore } from './NetScore';
import { RampUp } from './RampUp';
import { Correctness } from './Correctness';
import { FilePath } from '../typedefs/definitions'; // Assuming FilePath is imported from here

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

            console.log(`Processing URLs from "${this.urlFile}"...`);

            for await (const line of rl) {
                const url = line.trim();
                const evaluationResults = this.evaluateUrl(url);
                this.writeResults(evaluationResults);
            }

            console.log(`Successfully processed URLs. Output written to "${this.outputFile}".`);

        } catch (error) {
            console.error('Error processing file');
            process.exit(1); // Signal failure
        }
    }

    private evaluateUrl(url: string): Record<string, any> {
        // BusFactor latency
        const busFactorStart = process.hrtime();
        //const busFactor = new BusFactor(url).getScore();
        const busFactor = 1;
        const busFactorEnd = process.hrtime(busFactorStart);
        const busFactorLatency = (busFactorEnd[0] * 1e9 + busFactorEnd[1]) / 1e9; // Convert to seconds
    
        // ResponsiveMaintainer (RM) latency
        const rmStart = process.hrtime();
        //const responsiveMaintainer = new RM(url).getScore();
        const responsiveMaintainer = 1;
        const rmEnd = process.hrtime(rmStart);
        const rmLatency = (rmEnd[0] * 1e9 + rmEnd[1]) / 1e9; // Convert to seconds
    
        // License latency
        const licenseStart = process.hrtime();
        //const license = new License(url).getScore();
        const license = 1;
        const licenseEnd = process.hrtime(licenseStart);
        const licenseLatency = (licenseEnd[0] * 1e9 + licenseEnd[1]) / 1e9; // Convert to seconds
    
        // RampUp latency
        const rampUpStart = process.hrtime();
        //const rampUp = new RampUp(url).getScore();
        const rampUp = 1;
        const rampUpEnd = process.hrtime(rampUpStart);
        const rampUpLatency = (rampUpEnd[0] * 1e9 + rampUpEnd[1]) / 1e9; // Convert to seconds
    
        // Correctness latency
        const correctnessStart = process.hrtime();
        //const correctness = new Correctness(url).getScore();
        const correctness = 1;
        const correctnessEnd = process.hrtime(correctnessStart);
        const correctnessLatency = (correctnessEnd[0] * 1e9 + correctnessEnd[1]) / 1e9; // Convert to seconds
    
        // NetScore latency
        const netScoreStart = process.hrtime();
        const netScore = new NetScore({
            rampUp, 
            busFactor, 
            correctness, 
            responsiveMaintainer, 
            license,
            filepath: this.outputFile as FilePath // Pass the output file path for logging
        });
        const netScoreEnd = process.hrtime(netScoreStart);
        const netScoreLatency = (netScoreEnd[0] * 1e9 + netScoreEnd[1]) / 1e9; // Convert to seconds

        // Return evaluation results for logging/output
        return {
            URL: url,
            NetScore: netScore.score.toFixed(3),
            NetScore_Latency: netScoreLatency.toFixed(3),
            BusFactor: busFactor.toFixed(3),
            BusFactor_Latency: busFactorLatency.toFixed(3),
            ResponsiveMaintainer: responsiveMaintainer.toFixed(3),
            ResponsiveMaintainer_Latency: rmLatency.toFixed(3),
            RampUp: rampUp.toFixed(3),
            RampUp_Latency: rampUpLatency.toFixed(3),
            Correctness: correctness.toFixed(3),
            Correctness_Latency: correctnessLatency.toFixed(3),
            License: license.toFixed(3),
            License_Latency: licenseLatency.toFixed(3)
        };
    }

    private writeResults(result: Record<string, any>): void {
        // Write each result in NDJSON format to the output file
        fs.appendFileSync(this.outputFile, JSON.stringify(result) + '\n', 'utf8');
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
