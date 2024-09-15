class Metric {
    private score: number;

    constructor(score: number = 0) {
        this.score = score;
    }

    getScore(): boolean {
        return this.score === 0;
    }

    updateScore(newScore: number): void {
        this.score = newScore;
    }
}

export { Metric };