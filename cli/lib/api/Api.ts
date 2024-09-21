import { ApiResponse, Url } from "../typedefs/definitions";
import axios, { AxiosResponse } from 'axios';


interface ApiArgs {
    url: Url;
}

/**
 * API class
 * @class API
 * @param {ApiArgs} args
 * @param {Url} args.url - URL to make the request
 * @example
 * const api = new API({ url: 'https://api.github.com' });
 * const response = await api.get('/users/octocat');
 * console.log(response);
 * @throws {Error} - Error making GET request
 */
class API {
    protected _url: Url;

    constructor(args: ApiArgs) {
        this._url = args.url;
    }

    async get(endpoint: string): Promise<ApiResponse> {
        try {
            const response: AxiosResponse = await axios.get(`${this._url}${endpoint}`);
            return response.data;
        } catch (error) {
            console.error('Error making GET request:', error);
            throw error;
        }
    }


}

/**
 * GitHubApi class
 * @class GitHubApi
 * @extends API
 * @param {ApiArgs} args
 * @param {Url} args.url - URL to make the request
 * @example
 * const githubApi = new GitHubApi();
 * const response = await githubApi.get('/users/octocat');
 * console.log(response);
 */
class GitHubApi extends API {
    constructor() {
        super({ url: 'https://api.github.com' });
    }
}

/**
 * NpmApi class
 * @class NpmApi
 * @extends API
 * @param {ApiArgs} args
 * @param {Url} args.url - URL to make the request
 * @example
 * const npmApi = new NpmApi();
 * const response = await npmApi.get('/octocat');
 * console.log(response);
 */
class NpmApi extends API {
    constructor() {
        super({ url: 'https://registry.npmjs.org' });
    }
}

export { GitHubApi, NpmApi };