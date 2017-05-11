import FulfillmentBlock from "./FulfillmentBlock";
import * as inPlace from "in-place";
import ActionEnum from "./Actions/ActionEnum";

class GameState {
    public toConsumeOnNextCycle = 1;
    public timeOfMostRecentPause?: Date;
    private fulfillment: Array<FulfillmentBlock>;
    private maxFulfillment: number;
    private fulfillmentHandler: FulfilmentBlockHandler;

    constructor(maxFulfillment: number, fulFillment: Array<FulfillmentBlock>) {
        this.maxFulfillment = maxFulfillment;
        this.fulfillment = fulFillment;

        const fulfilmentBlockValues = new Map<ActionEnum, Array<number>>();

        fulfilmentBlockValues.set(ActionEnum.Pizza, [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);
        fulfilmentBlockValues.set(ActionEnum.VideoGames, [20, 20, 20, 8, 7, 6, 5, 5, 5, 4]);
        fulfilmentBlockValues.set(ActionEnum.Reading, [10, 20, 50, 4, 3, 3, 3, 3, 2, 2]);
        fulfilmentBlockValues.set(ActionEnum.Intimacy, [20, 10, 20, 10, 20, 10, 5, 3, 1, 1]);

        this.fulfillmentHandler = new FulfilmentBlockHandler(fulfilmentBlockValues);
    }

    public getFulfillment(): Array<FulfillmentBlock> {
        return this.fulfillment;
    }

    public getMaxFulfillment(): number {
        return this.maxFulfillment;
    }

    public addFulfillment(action: ActionEnum): void {
        console.log('Adding fulfillment out of', action);
        if (!this.fulfillmentHandler.isEmpty(action) && (this.fulfillment.length < this.maxFulfillment)) {
            const block = this.fulfillmentHandler.makeFulfilmentBlock(action);
            this.fulfillment.push(block);
            console.log('Here');
        }
    }

    public consumeFulfillment(): number {
        let howMuch = ~~this.toConsumeOnNextCycle + 1;
        let fulfillmentConsumed = howMuch;
        this.toConsumeOnNextCycle = 0;
        while (this.fulfillment.length !== 0 && howMuch--) {
            const lastFulfillmentBlock = this.fulfillment[this.fulfillment.length - 1];
            lastFulfillmentBlock.consume();
            this.clear();
        }

        return fulfillmentConsumed;
    }

    private clear() {
        inPlace.filter(this.fulfillment, (block: FulfillmentBlock, i: number) => {
            return block.isDone() === false;
        })
    }
}

class FulfilmentBlockHandler {
    private fulfillmentBlockValues: Map<ActionEnum, Array<number>>;
    private fulfillmentBlockIndices: Map<ActionEnum, number>;

    constructor(map: Map<ActionEnum, Array<number>>) {
        this.fulfillmentBlockValues = map;
        this.fulfillmentBlockIndices = new Map<ActionEnum, number>();
        this.reset();
    }

    reset() {
        this.fulfillmentBlockValues.forEach((blockSizes: Array<number>, key: ActionEnum) => {
            this.fulfillmentBlockIndices.set(key, 0);
        });
    }

    isEmpty(action: ActionEnum): boolean {
        let index = this.fulfillmentBlockIndices.get(action);
        return (index > this.fulfillmentBlockValues.get(action)[index])
    }

    makeFulfilmentBlock(action: ActionEnum): FulfillmentBlock {
        let index = this.fulfillmentBlockIndices.get(action);
        if (index > this.fulfillmentBlockValues.get(action).length) {
            throw new Error('No more fulfilment to give');
        }
        this.fulfillmentBlockIndices.set(action, index + 1);

        return new FulfillmentBlock(this.fulfillmentBlockValues.get(action)[index]);
    }
}

export default GameState;
