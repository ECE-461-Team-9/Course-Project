import { GitHubApi } from '../lib/api/GitHubApi';

// Mock the GitHubApi to prevent actual API calls during testing.
// This replaces the real implementation of GitHubApi with a mock.
jest.mock('../lib/api/GitHubApi');

/**
 * Class to calculate the Bus Factor of a GitHub repository
 * Bus Factor measures how many contributors are working on the repository,
 * and evaluates the project's risk if some of them stop contributing.
 */
class BusFactorMetric {
  private api: GitHubApi;  // Instance of the GitHubApi class to interact with GitHub API

  constructor() {
    // Initialize GitHubApi instance
    this.api = new GitHubApi();
  }

  /**
   * Calculates the Bus Factor for a given GitHub repository.
   * @param repo - The GitHub repository in the form of 'owner/repo'.
   * @returns A score between 0 and 1 indicating the Bus Factor, where higher is better.
   */
  async calculate(repo: string): Promise<number> {
    try {
      // Fetch contributors from the GitHub API for the given repository
      const contributors = await this.api.get(`/repos/${repo}/contributors`);

      // Calculate Bus Factor as the number of contributors divided by 10, capped at 1.
      // If no contributors, return 0.
      return Array.isArray(contributors) ? Math.min(contributors.length / 10, 1) : 0;
    } catch (error) {
      // Log and rethrow any errors that occur during the calculation process
      console.error('Error calculating Bus Factor:', error);
      throw error;
    }
  }
}

// Test suite for the BusFactorMetric class
describe('BusFactorMetric', () => {
  let busFactorMetric: BusFactorMetric;

  // Before each test, create a new instance of BusFactorMetric
  beforeEach(() => {
    busFactorMetric = new BusFactorMetric();
  });

  // Test for checking if the Bus Factor is correctly calculated to be between 0 and 1
  test('should return a score between 0 and 1', async () => {
    // Mock the API response to simulate contributors being returned from GitHub
    (GitHubApi.prototype.get as jest.Mock).mockResolvedValue([
      { login: 'user1', contributions: 100 },
      { login: 'user2', contributions: 50 },
      { login: 'user3', contributions: 25 },
    ]);

    // Call the calculate method and check if the score is between 0 and 1
    const score = await busFactorMetric.calculate('owner/repo');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  // Test to check if fewer contributors lead to a lower Bus Factor score
  test('should return a lower score for repositories with few contributors', async () => {
    // Mock API response to simulate a repository with fewer contributors
    (GitHubApi.prototype.get as jest.Mock).mockResolvedValue([
      { login: 'user1', contributions: 100 },
      { login: 'user2', contributions: 10 },
    ]);

    // The score should be less than 0.5 (indicating fewer contributors)
    const score = await busFactorMetric.calculate('owner/repo');
    expect(score).toBeLessThan(0.5);
  });

  // Test to verify that a repository with many contributors gets a higher Bus Factor score
  test('should return a higher score for repositories with many contributors', async () => {
    // Mock API response to simulate a repository with many contributors
    (GitHubApi.prototype.get as jest.Mock).mockResolvedValue([
      { login: 'user1', contributions: 100 },
      { login: 'user2', contributions: 90 },
      { login: 'user3', contributions: 80 },
      { login: 'user4', contributions: 70 },
      { login: 'user5', contributions: 60 },
    ]);

    // The score should be greater than or equal to 0.5 (indicating more contributors)
    const score = await busFactorMetric.calculate('owner/repo');
    expect(score).toBeGreaterThanOrEqual(0.5);
  });

   // Test to handle cases where the repository has only one contributor
   test('should handle repositories with only one contributor', async () => {
    // Mock API response to simulate a repository with a single contributor
    (GitHubApi.prototype.get as jest.Mock).mockResolvedValue([
      { login: 'user1', contributions: 100 },
    ]);

    // The score should be less than 0.5 (since there is only one contributor)
    const score = await busFactorMetric.calculate('owner/repo');
    expect(score).toBeLessThan(0.5);
  });

  // Test to handle repositories that have no contributors
  test('should handle repositories with no contributors', async () => {
    // Mock API response to simulate a repository with no contributors
    (GitHubApi.prototype.get as jest.Mock).mockResolvedValue([]);

    // The score should be 0 since there are no contributors
    const score = await busFactorMetric.calculate('owner/repo');
    expect(score).toBe(0);
  });

  // Test to ensure the function handles errors (e.g., API failure) gracefully
  test('should handle API errors gracefully', async () => {
    // Mock the API to throw an error to simulate an API failure
    (GitHubApi.prototype.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    // Expect the function to throw an error when API fails
    await expect(busFactorMetric.calculate('owner/repo')).rejects.toThrow('API Error');
  });
});