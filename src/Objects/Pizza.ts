import ActionEnum from "../Actions/ActionEnum";
import InterractableInterface from "../Interfaces/InterractableInterface";
export default class Pizza extends Phaser.Sprite implements InterractableInterface{

    public readonly action = ActionEnum.Pizza;

    public static make(game: Phaser.Game, x:number, y:number){
        return new Pizza(game, x, y, 'sprites', 'framed_pizza');
    }
}