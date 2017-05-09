import Humanoid from "./Humanoid";
import Hero from "./Actors/Hero";
import zeroFill = require("zero-fill");
import Tv from "./Objects/Tv";
import Bookcase from "./Objects/Bookcase";
import Pizza from "./Objects/Pizza";

export default class SpriteFactory {
    game: Phaser.Game;

    constructor(game: Phaser.Game) {
        this.game = game;
    }

    hero(x: number, y: number): Humanoid {
        const hero = Hero.make(this.game,x,y);
        hero.width = hero.height = 150;
        hero.anchor.set(0.5);
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
        const tv = Tv.make(this.game, x, y);
        tv.width = 320;
        tv.height = 320;
        return tv;
    }

    bookcase(x: number, y: number): Phaser.Sprite {
        const bookcase = Bookcase.make(this.game, x,y);
        bookcase.name = 'bookcase';
        bookcase.width = 320;
        bookcase.height = 320;
        return bookcase;
    }

    pizza(x: number, y: number): Phaser.Sprite {
        const pizza = Pizza.make(this.game, x,y);
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
