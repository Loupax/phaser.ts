import FulfillmentBlock from "./FulfillmentBlock";
import * as inPlace from "in-place";

class GameState {
    public toConsumeOnNextCycle = 1;
    public timeOfMostRecentPause?: Date;
    private fulfillment: Array<FulfillmentBlock>;
    private maxFulfillment: number;

    constructor(maxFulfillment: number, fulFillment: Array<FulfillmentBlock>) {
        this.maxFulfillment = maxFulfillment;
        this.fulfillment = fulFillment;
    }

    public getFulfillment(): Array<FulfillmentBlock> {
        return this.fulfillment;
    }

    public getMaxFulfillment(): number {
        return this.maxFulfillment;
    }

    public addFulfillment(block: FulfillmentBlock): void {
        if (this.fulfillment.length < this.maxFulfillment) {
            this.fulfillment.push(block);
            this.fulfillment.sort((a: FulfillmentBlock, b: FulfillmentBlock) => {
                return a.value() - b.value();
            });
        }
    }

    public consumeFulfillment() {
        let howMuch = ~~this.toConsumeOnNextCycle + 1;
        this.toConsumeOnNextCycle = 0;
        while (this.fulfillment.length !== 0 && howMuch--) {
            const lastFulfillmentBlock = this.fulfillment[this.fulfillment.length - 1];
            lastFulfillmentBlock.consume();
            this.clear();
        }

    }

    private clear() {
        inPlace.filter(this.fulfillment, (block: FulfillmentBlock, i: number) => {
            return block.isDone() === false;
        })
    }
}

export default GameState;
