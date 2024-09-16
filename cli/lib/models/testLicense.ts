import { License } from './License'; // Adjust the path as needed
import fs from 'fs';
import * as git from 'isomorphic-git';
import * as http from 'http';
import * as https from 'https';

async function runTests() {
    const repoUrl = 'https://github.com/jonschlinkert/even';
    const repoPath = '/path/to/local/repo'; // Use a real local path or set up a temporary directory
    const compatibleLicenses = ['MIT', 'LGPLv2.1']; // Example compatible licenses

    // Initialize the License instance
    const license = new License(repoUrl, compatibleLicenses);

    // Test case: License file with compatible license
    console.log('Running Test: License File with Compatible License');

    try {
        const result = await license.checkLicenseStatus();
        console.log('Test Result:', result ? 'Pass' : 'Fail');
    } catch (error) {
        console.error('Error during test:', error);
    }

}

// Run the tests
runTests();
