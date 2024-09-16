import { Url } from "../typedefs/definitions";

export class Metric {
    public score: number;
    public URL: Url;

    constructor(Url: string) {
        this.URL = Url;
        this.score = 0;
    }

    getScore(): number {
        return this.score;
    }

    updateScore(newScore: number): void {
        this.score = newScore;
    }
}