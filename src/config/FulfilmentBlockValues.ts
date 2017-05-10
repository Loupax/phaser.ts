import ActionEnum from "../Actions/ActionEnum";
import FulfillmentBlock from "../FulfillmentBlock";

const fulfilmentBlockValues = new Map<ActionEnum, Array<number>>();

fulfilmentBlockValues.set(ActionEnum.Pizza, [10,10,10,10,10,10,10,10,10,10]);
fulfilmentBlockValues.set(ActionEnum.VideoGames, [10,10,10,10,10,10,10,10,10,10]);
fulfilmentBlockValues.set(ActionEnum.Reading, [10,10,10,10,10,10,10,10,10,10]);
fulfilmentBlockValues.set(ActionEnum.Intimacy, [10,10,10,10,10,10,10,10,10,10]);

class FulfilmentBlockHandler{
    private fulfillmentBlockValues: Map<ActionEnum, Array<number>>;
    private fulfillmentBlockIndices: Map<ActionEnum, number>;

    constructor(map: Map<ActionEnum, Array<number>>)
    {
        this.fulfillmentBlockValues = map;
        this.fulfillmentBlockIndices = new Map<ActionEnum, number>();
        this.reset();
    }

    reset(){
        this.fulfillmentBlockValues.forEach((blockSizes:Array<number>, key:ActionEnum)=>{
            this.fulfillmentBlockIndices.set(key, 0);
        });
    }

    isEmpty(action:ActionEnum):boolean{
        let index = this.fulfillmentBlockIndices.get(action);
        return (index > this.fulfillmentBlockValues.get(action)[index])
    }

    makeFulfilmentBlock(action:ActionEnum):FulfillmentBlock{
        let index = this.fulfillmentBlockIndices.get(action);
        this.fulfillmentBlockIndices.set(action, index+1);

        return new FulfillmentBlock(this.fulfillmentBlockValues.get(action)[index]);
    }
}

const handler = new FulfilmentBlockHandler(fulfilmentBlockValues);
export default handler;

