import ActionEnum from "../Actions/ActionEnum";
import InterractableInterface from "../Interfaces/InterractableInterface";
export default class Bookcase extends Phaser.Sprite implements InterractableInterface{

    public readonly action = ActionEnum.Reading;

    public static make(game: Phaser.Game, x:number, y:number){
        return game.add.sprite(x, y, 'sprites', 'bookcase_square');
    }
}