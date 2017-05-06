import * as Phaser from "phaser";
import Room from "./Room";


export default class Game extends Phaser.Game {
    constructor() {
        super(640, 640, Phaser.AUTO, 'content', null);

        this.state.add('Room', Room, false);
        this.state.start('Room');
    }
}
