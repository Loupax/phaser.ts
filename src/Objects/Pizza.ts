import ActionEnum from "../Actions/ActionEnum";
import InterractableInterface from "../Interfaces/InterractableInterface";
export default class Pizza extends Phaser.Sprite implements InterractableInterface{

    public readonly action = ActionEnum.Pizza;

    public static make(game: Phaser.Game, x:number, y:number){
        return game.add.sprite(0, 0, 'sprites', 'framed_pizza');
    }
}