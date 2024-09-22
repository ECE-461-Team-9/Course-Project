import * as git from 'isomorphic-git';
import * as fs from 'fs';
import * as http from 'isomorphic-git/http/node';
import { Metric } from './Metric';
import { SystemLogger } from '../utilities/logger';
import { execSync } from 'child_process';

SystemLogger.initialize();


export class Correctness extends Metric {
    private repoPath: string;
    public score: number;

    constructor(Url: string) {
        SystemLogger.info(`Correctness initialized with URL: ${Url}`);
        super(Url);
        this.repoPath = '/home/shay/a/smit4407/Documents/Course-Project-461/test';
        this.score = 0;
    }

    async init(): Promise<void> {
        await this.cloneRepository();
        this.score = await this.checkCorrectness();
        // this.cleanUpRepo();
    }

    private async cloneRepository(): Promise<void> {
        try {
            SystemLogger.info(`Cloning repository from ${this.URL}`);
            await git.clone({
                fs,
                http,
                dir: this.repoPath,
                url: this.URL,
                depth: 1,
            });
        } catch (error) {
            SystemLogger.error(`Error cloning repository: ${error}`);
            throw error;
        }
    }

    private async checkCorrectness(): Promise<number> {
        try {
            //checks if the pack
            let score = 0;

            const hasTests = this.detectTestFramework();
            console.log(hasTests);
            if (!hasTests) {
                SystemLogger.info('No tests detected in the repository');
                return 0;
            }
            score = 0.25;

            const testResults = this.runTests();
            return this.calculateScore(testResults);
        } catch (error) {
            SystemLogger.error(`Error checking correctness: ${error}`);
            return 0;
        }
    }

    private detectTestFramework(): boolean {
        const packageJsonPath = `${this.repoPath}/package.json`;
        if (fs.existsSync(packageJsonPath)) {
            //allows to parse with json
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

            if (packageJson.scripts.test) {
                return true;
            }

            //get devDependencies and depnedencies
            const devDependencies = packageJson.devDependencies || {};
            const dependencies = packageJson.dependencies || {};

            //checks the             
            const testFrameworks = ['jest', 'mocha', 'jasmine', 'ava', 'tape'];
            return testFrameworks.some(framework => 
                devDependencies[framework] || dependencies[framework]
            );
        }
        return false;
    }

    private runTests(): { passed: number, total: number } {
        try {
            //go to main root
            console.log('Starting test process');
            process.chdir(this.repoPath);

            console.log('Installing dependencies');
            execSync('npm install', { stdio: 'inherit' });

            console.log('Running tests');
            const testOutput = execSync('npx jest --json', { encoding: 'utf-8', stdio: 'pipe' });

            console.log(testOutput);
            
            // This is a simple regex to match "X passing" and "Y failing".
            // You might need to adjust this based on the actual output format.
            const passingMatch = testOutput.match(/.*PassedTests":(\d+).*/);
            const failingMatch = testOutput.match(/.*FailedTests":(\d+).*/);

            console.log('ending');

            
            //1 is the first captured group, so the int
            const passed = passingMatch ? parseInt(passingMatch[1]) : 0;
            const failed = failingMatch ? parseInt(failingMatch[1]) : 0;
            console.log(passed);
            console.log(failed);
            const total = passed + failed;

            return { passed, total };
        } catch (error) {
            console.log(error);
            SystemLogger.error(`Error running tests: ${error}`);
            return { passed: 0, total: 0 };
        }
    }

    private calculateScore(testResults: { passed: number, total: number }): number {
        if (testResults.total === 0){
            return 0;
        } 
        return testResults.passed / testResults.total;
    }

    private cleanUpRepo(): void {
        if (fs.existsSync(this.repoPath)) {
            try {
                fs.rmSync(this.repoPath, { recursive: true, force: true });
            } catch (error) {
                SystemLogger.error(`Error cleaning up repository: ${error}`);
            }
        }
    }
}