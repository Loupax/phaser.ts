import Humanoid from "../Humanoid";
import zeroFill = require("zero-fill");

export default class Hero extends Humanoid {
    public static make(game: Phaser.Game, x: number, y: number) {
        const hero = new Humanoid(game, x, y, 'sprites', 'blue_square_guy_0');
        hero.name = 'hero';

        hero.animations.add('idle', ['blue_square_guy_0', 'blue_square_guy_1'], 0.5, true);
        hero.animations.add('walk', ['blue_square_guy_0', 'blue_square_guy_1'], 8, true);
        hero.animations.add('reading', ['blue_square_guy_reading_0', 'blue_square_guy_reading_1'], 2, true);
        hero.animations.add('sitting_back', ['blue_square_guy_sitting_back_0'], 1, false);

        const eatingFrames = [];
        for (let idx = 0; idx < 19; idx++) {
            eatingFrames.push(`blue_square_guy_eating_pizza_${zeroFill(2, idx)}`);
        }
        hero.animations.add('eat', eatingFrames, 10);

        game.add.existing(hero);

        return hero;
    }
}
