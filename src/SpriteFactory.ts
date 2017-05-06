import Humanoid from "./Humanoid";
import zeroFill = require("zero-fill");

export default class SpriteFactory {
    game: Phaser.Game;

    constructor(game: Phaser.Game) {
        this.game = game;
    }

    hero(x: number, y: number): Humanoid {
        const hero = new Humanoid(this.game, x, y, 'sprites', 'blue_square_guy_0');
        hero.name = 'hero';

        hero.width = hero.height = 150;

        hero.anchor.set(0.5);


        hero.animations.add('idle', ['blue_square_guy_0', 'blue_square_guy_1'], 0.5, true);
        hero.animations.add('walk', ['blue_square_guy_0', 'blue_square_guy_1'], 8, true);
        hero.animations.add('reading', ['blue_square_guy_reading_0', 'blue_square_guy_reading_1'], 2, true);
        hero.animations.add('sitting_back', ['blue_square_guy_sitting_back_0'], 1, false);

        const eatingFrames = [];
        for (let idx = 0; idx < 19; idx++) {
            eatingFrames.push(`blue_square_guy_eating_pizza_${zeroFill(2, idx)}`);
        }
        hero.animations.add('eat', eatingFrames, 10);
        //console.log(eatingFrames);
        this.game.add.existing(hero);
        this.setUpHeroPhysics(hero);
        return hero;
    }

    girl(x: number, y: number): Humanoid {
        const girl = new Humanoid(this.game, x, y, 'sprites', 'square_girl_0');
        girl.inputEnabled = true;
        girl.anchor.set(0.5);
        girl.width = girl.height = 150;
        this.game.add.existing(girl);
        this.setUpHeroPhysics(girl);
        return girl;
    }

    tv(x: number, y: number): Phaser.Sprite {
        const tv = this.game.add.sprite(x, y, 'sprites', 'tv_off');
        tv.width = 320;
        tv.height = 320;

        tv.animations.add(
            'off',
            ['tv_off'],
            1,
            false
        );

        tv.animations.add(
            'starting', [
                'tv_starting_0',
                'tv_starting_1',
                'tv_starting_2',
                'tv_starting_3',
                'tv_starting_4',
                'tv_starting_5',
                'tv_starting_6',
            ],
            8,
            false
        );

        tv.animations.add(
            'shutting_down', [
                'tv_starting_6',
                'tv_starting_5',
                'tv_starting_4',
                'tv_starting_3',
                'tv_starting_2',
                'tv_starting_1',
                'tv_starting_0',
            ],
            16,
            false
        );

        tv.animations.add(
            'playing',
            [
                'tv_playing_0',
                'tv_playing_1'
            ],
            8,
            true
        );

        tv.animations.play('off');
        return tv;
    }

    bookcase(x: number, y: number): Phaser.Sprite {
        const bookcase = this.game.add.sprite(x, y, 'sprites', 'bookcase_square');
        bookcase.name = 'bookcase';
        bookcase.width = 320;
        bookcase.height = 320;
        return bookcase;
    }

    pizza(x: number, y: number): Phaser.Sprite {
        const pizza = this.game.add.sprite(0, 0, 'sprites', 'framed_pizza');
        pizza.width = pizza.height = 320;
        return pizza;
    }

    transparentBg(): Phaser.Sprite {
        const bg = this.game.add.sprite(0, 0, this.game.add.bitmapData(this.game.width, this.game.height));
        bg.inputEnabled = true;
        return bg;
    }

    private setUpHeroPhysics(hero: Phaser.Sprite): void {
        this.game.physics.enable(hero);
        hero.body.collideWorldBounds = true;
        hero.body.bounce.y = 0.1;
    }

}
