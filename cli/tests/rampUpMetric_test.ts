import { GitHubApi } from '../lib/api/GitHubApi';

// Mock the GitHubApi to simulate API requests during tests without hitting the actual GitHub API
jest.mock('../lib/api/GitHubApi');

// Define interfaces for GithubFile and GithubReadme to specify the expected response types
interface GithubFile {
  name: string;
  type: string;
}

interface GithubReadme {
  content: string;
}

// RampUpMetric class to calculate the ramp-up metric for a given repository
class RampUpMetric {
  private api: GitHubApi;

  constructor() {
    // Initialize the GitHubApi instance to interact with the GitHub API
    this.api = new GitHubApi();
  }

  // Main method to calculate the ramp-up metric based on the repository's files and README content
  async calculate(repo: string): Promise<number> {
    try {
      // Fetch the repository's content (files) and parse the response
      const filesResponse = await this.api.get(`/repos/${repo}/contents`);
      const files = this.parseFilesResponse(filesResponse);

      // Fetch the README file content
      const readmeContent = await this.getReadmeContent(repo);

      // Analyze code complexity and documentation quality
      const codeComplexity = this.analyzeCodeComplexity(files);
      const documentationScore = this.analyzeDocumentation(readmeContent);
      
      // Return a weighted average score based on code complexity and documentation quality
      return (codeComplexity * 0.6 + documentationScore * 0.4);
    } catch (error) {
      console.error('Error calculating Ramp-Up Metric:', error);
      throw error;
    }
  }

  // Helper method to validate and parse the response of the repository's file contents
  private parseFilesResponse(response: unknown): GithubFile[] {
    if (Array.isArray(response) && response.every(item => this.isGithubFile(item))) {
      return response;
    }
    throw new Error('Invalid response format for files');
  }
  // Type guard method to ensure each item is a valid GithubFile object
  private isGithubFile(item: unknown): item is GithubFile {
    return typeof item === 'object' && item !== null &&
           'name' in item && typeof item.name === 'string' &&
           'type' in item && typeof item.type === 'string';
  }

  // Fetch and decode the README content from the repository
  private async getReadmeContent(repo: string): Promise<string> {
    try {
      // Fetch the README file and decode its content from base64
      const readmeResponse = await this.api.get(`/repos/${repo}/readme`);
      if (this.isGithubReadme(readmeResponse)) {
        return Buffer.from(readmeResponse.content, 'base64').toString('utf-8');
      }
      throw new Error('Invalid response format for README');
    } catch {
      return '';  // Return an empty string if README is missing or invalid
    }
  }

   // Type guard method to ensure the README response is in the expected format
   private isGithubReadme(response: unknown): response is GithubReadme {
    return typeof response === 'object' && response !== null &&
           'content' in response && typeof response.content === 'string';
  }

   // Analyze the code complexity based on the number of code files in the repository
   private analyzeCodeComplexity(files: GithubFile[]): number {
    const totalFiles = files.length;
    const codeExtensions = [
      '.ts', '.js', '.dart', '.py', '.java', '.cpp', '.cs', 
      '.go', '.rb', '.php', '.c', '.swift', '.rs', '.kt', 
      '.sh', '.r', '.m', '.pl', '.html', '.css'
    ]
    const codeFiles = files.filter(file => 
      file.type === 'file' && codeExtensions.some(ext => file.name.endsWith(ext))
    ).length;
    
    // Return a normalized complexity score between 0 and 1
    return Math.min(codeFiles / totalFiles, 1);
  }

  // Analyze the quality of the documentation based on the README content
  private analyzeDocumentation(readmeContent: string): number {
    const hasInstallInstructions = readmeContent.toLowerCase().includes('install');
    const hasUsageExamples = readmeContent.toLowerCase().includes('usage');
    const hasAPIReference = readmeContent.toLowerCase().includes('api');

    // Score based on the presence of key sections in the README
    let score = 0;
    if (hasInstallInstructions) score += 0.33;
    if (hasUsageExamples) score += 0.33;
    if (hasAPIReference) score += 0.34;

    return score;
  }
}

describe('RampUpMetric', () => {
  let rampUpMetric: RampUpMetric;

  // Set up a new RampUpMetric instance before each test
  beforeEach(() => {
    rampUpMetric = new RampUpMetric();
  });

  test('should return a lower score for complex codebase with poor documentation', async () => {

    // Mock the API response for a more complex codebase with limited README content
    (GitHubApi.prototype.get as jest.Mock).mockImplementation((endpoint: string) => {
      if (endpoint.includes('/contents')) {
        return [
          { name: 'file1.ts', type: 'file' },
          { name: 'file2.ts', type: 'file' },
          { name: 'file3.ts', type: 'file' },
          { name: 'file4.ts', type: 'file' },
          { name: 'folder', type: 'dir' }
        ];
      } else if (endpoint.includes('/readme')) {
        return { content: Buffer.from('# Project').toString('base64') };
      }
    });

    const score = await rampUpMetric.calculate('owner/repo');
    expect(score).toBeLessThan(0.5); // Expect a lower score due to complexity and poor docs
  });

  
  test('should return a higher score for simple codebase with good documentation', async () => {

    // Mock the API response for a simple codebase with comprehensive README content
    (GitHubApi.prototype.get as jest.Mock).mockImplementation((endpoint: string) => {
      if (endpoint.includes('/contents')) {
        return [
          { name: 'file1.ts', type: 'file' },
          { name: 'README.md', type: 'file' },
          { name: 'folder', type: 'dir' }
        ];
      } else if (endpoint.includes('/readme')) {
        return { content: Buffer.from('# Project\n## Installation\nInstructions here\n## Usage\nExamples here\n## API\nAPI documentation').toString('base64') };
      }
    });

    const score = await rampUpMetric.calculate('owner/repo');
    expect(score).toBeGreaterThanOrEqual(0.5);
  });

  
  test('should handle missing README', async () => {
    // Mock the API response to simulate a missing README file
    (GitHubApi.prototype.get as jest.Mock).mockImplementation((endpoint: string) => {
      if (endpoint.includes('/contents')) {
        return [
          { name: 'file1.ts', type: 'file' },
          { name: 'file2.ts', type: 'file' },
          { name: 'folder', type: 'dir' }
        ];
      } else if (endpoint.includes('/readme')) {
        throw new Error('README not found');
      }
    });

    const score = await rampUpMetric.calculate('owner/repo');
    expect(score).toBeLessThan(0.5); // Expect a lower score due to missing README
  });

  test('should handle API errors gracefully', async () => {
    // Mock the API response to throw an error
    (GitHubApi.prototype.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    // Expect the calculation to throw an API error
    await expect(rampUpMetric.calculate('owner/repo')).rejects.toThrow('API Error');
  });

  test('should handle invalid file response format', async () => {
    // Mock the API to return an invalid file response

  }

