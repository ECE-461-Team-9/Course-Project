import { Url } from "../typedefs/definitions";

export class Metric {
    public score: number;
    public URL: Url;

    constructor(Url: string) {
        this.URL = Url;
        this.score = 0;
    }

    getScore(): Promise<number> {
        console.log("Score: " + this.score);
        return Promise.resolve(this.score);
    }

    updateScore(newScore: number): void {
        this.score = newScore;
    }
}