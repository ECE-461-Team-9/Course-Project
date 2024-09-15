import { FilePath, Json, Score } from "../typedefs/definitions";
import * as fs from 'fs';

interface NetScoreArgs {
    rampUp: Score;
    busFactor: Score;
    correctness: Score;
    responsiveMaintainer: Score;
    license: Score;
    filepath: FilePath;
}

/**
 * NetScore class
 * @class NetScore
 * @param {NetScoreArgs} args
 * @param {Score} args.rampUp - Ramp up score
 * @param {Score} args.busFactor - Bus factor score
 * @param {Score} args.correctness - Correctness score
 * @param {Score} args.responsiveMaintainer - Responsive maintainer score
 * @param {Score} args.license - License score
 * @param {FilePath} args.filepath - Filepath to write the output
 * @throws {Error} - Metrics must be between 0 and 1
 * @example
 * const netScore = new NetScore({
 *  rampUp: 0.8,
 *  busFactor: 0.9,
 *  correctness: 0.7,
 *  responsiveMaintainer: 0.6,
 *  license: 0.5,
 *  filepath: './output.json'
 * });
 */
class NetScore {
    constructor({ rampUp, busFactor, correctness, responsiveMaintainer, license }: NetScoreArgs) {
        this._rampUp = rampUp;
        this._busFactor = busFactor;
        this._correctness = correctness;
        this._responsiveMaintainer = responsiveMaintainer;
        this._license = license;
        const _metrics: number[] = [this._rampUp, this._busFactor, this._correctness, this._responsiveMaintainer, this._license];

        if (_metrics.some(metric => metric < 0 || metric > 1)) {
            throw new Error('Metrics must be between 0 and 1');
        }

        this._calculate();


    }
    private _rampUp: Score;
    private _busFactor: Score;
    private _correctness: Score;
    private _responsiveMaintainer: Score;
    private _license: Score;
    private _score: number = 0;


    get score(): Score {
        return this._score;
    }

    private _calculate(): void {
        this._score = this._license * ((0.2 * this._rampUp) + (0.2 * this._busFactor) + (0.2 * this._correctness) + (0.4 * this._responsiveMaintainer));
    }

    private _output(filepath: FilePath): void {
        const data: Json = new Map();
        data.set('NetScore', this._score);
        data.set('NetScore_Latency', new Date().toISOString());
        data.set('RampUp', this._rampUp);
        data.set('RampUp_Latency', new Date().toISOString());
        data.set('BusFactor', this._busFactor);
        data.set('BusFactor_Latency', new Date().toISOString());
        data.set('Correctness', this._correctness);
        data.set('Correctness_Latency', new Date().toISOString());
        data.set('ResponsiveMaintainer', this._responsiveMaintainer);
        data.set('ResponsiveMaintainer_Latency', new Date().toISOString());
        data.set('License', this._license);
        data.set('License_Latency', new Date().toISOString());

        // Convert Map to plain object
        const obj: object = Object.fromEntries(data);

        // Convert object to JSON string
        const jsonString: string = JSON.stringify(obj, null, 2);

        fs.writeFile(filepath, jsonString, (err) => {
            if (err) {
                console.error('Error writing to file', err);
            } else {
                console.log('File written successfully');
            }
        });
    }

}

export { NetScore };