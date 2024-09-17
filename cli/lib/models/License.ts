import 'isomorphic-git';
import 'fs';
import 'http'; // For HTTP requests
import 'https'; // For HTTPS requests
import { Metric } from './Metric';


export class License extends Metric {
    // private repoPath; // Path to the repository on the local filesystem
    private compatibleLicenses; // List of compatible licenses

    constructor(Url: string, compatibleLicenses: string[] = ['LGPLv2.1']) {
        super(Url);
        this.compatibleLicenses = compatibleLicenses; // Initialize the list of compatible licenses
        this.score = this.checkLicenseStatus()
    }

    // Method to check the license status
    checkLicenseStatus(): number {
        const today = new Date();
        return this.checkCompatibilityWithLicenses(); // Check compatibility if valid and not expired
    }

    // Method to update the license status
    updateLicenseStatus(score: number): void {
        this.score = score;
    }

    // Private method to check if the license in the Git repository is compatible with any of the given licenses
    private checkCompatibilityWithLicenses(): number {
        try {
        //    // Initialize the repository
        //     await git.init({
        //         fs,
        //         dir: this.repoPath,
        //         defau ltBranch: 'main',
        //     });

        //     // Fetch the repository from the URL
        //     await git.clone({
        //         fs,
        //         http,
        //         https,
        //         dir: this.repoPath,
        //         url: this.repoUrl,
        //         singleBranch: true,
        //         branch: 'main', // Specify the branch if needed
        //     });

        //     // Define a list of common license file paths
        //     const licensePaths = [
        //         'LICENSE',
        //         'license',
        //         'LICENSE.txt',
        //         'license.txt',
        //         'LICENSE.md',
        //         'license.md'
        //     ];

        //     // Check each path for the license file
        //     for (const path of licensePaths) {
        //         const filePath = `${this.repoPath}/${path}`;
        //         if (fs.existsSync(filePath)) {
        //             const fileContent = fs.readFileSync(filePath, 'utf-8');
        //             const licenseData = JSON.parse(fileContent).license;
        //             if (this.compatibleLicenses.includes(licenseData)) {
        //                 return 1; // License is compatible
        //             }
        //         }
        //     }

            console.log('License file not found in known paths or not compatible.');
            return 0;
        } catch (error) {
            console.error('Error fetching or checking license data:', error);
            return 0;
        }
    }
}

