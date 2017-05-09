import ActionEnum from "../Actions/ActionEnum";
const fulfilmentBlockValues = new Map<ActionEnum, Array<number>>();

fulfilmentBlockValues.set(ActionEnum.Pizza, [10,10,10,10,10,10,10,10,10,10]);
fulfilmentBlockValues.set(ActionEnum.VideoGames, [10,10,10,10,10,10,10,10,10,10]);
fulfilmentBlockValues.set(ActionEnum.Reading, [10,10,10,10,10,10,10,10,10,10]);
fulfilmentBlockValues.set(ActionEnum.Intimacy, [10,10,10,10,10,10,10,10,10,10]);

export default fulfilmentBlockValues;

