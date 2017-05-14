type SaveObject = {
    life: number
}

export default class FulfillmentBlock {

    public life: number;

    constructor(life: number) {
        this.life = life;
    }

    public isDone(): boolean {
        return this.life <= 0;
    }

    public value() {
        return this.life;
    }

    public consume(): void {
        this.life--;
    }
}
