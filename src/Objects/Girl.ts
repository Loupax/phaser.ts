import Humanoid from "../Humanoid";
import InterractableInterface from "../Interfaces/InterractableInterface";
import ActionEnum from "../Actions/ActionEnum";

export default class Girl extends Humanoid implements InterractableInterface{
    action: ActionEnum = ActionEnum.Intimacy;

    static make(game: Phaser.Game, x:number, y:number):Girl
    {
        return new Girl(game, x, y, 'sprites', 'square_girl_0');
    }
}