import * as Phaser from 'phaser';
import Point = Phaser.Point;

export default class Room extends Phaser.State {

    walkingTween: Phaser.Tween;
    hero: Phaser.Sprite;
    girl: Phaser.Sprite;

    preload() {
        this.load.atlasJSONHash('sprites', 'img/sprite.png', 'img/sprite.json');
    }

    create() {
        const room = this;
        const bg = this.add.sprite(0, 0, this.add.bitmapData(this.game.width, this.game.height));
        bg.inputEnabled = true;

        const pizza = this.add.sprite(0, 0, 'sprites', 'framed_pizza');
        pizza.width = pizza.height = 320;

        const bookcase = this.getBookcase();
        const tv = this.add.sprite(320, 320, 'sprites', 'square_tv_screen');
        tv.width = 320;
        tv.height = 320;
        const hero = this.getHero();
        const girl = this.girl = this.add.sprite(4, 589, 'sprites', 'square_girl_0');
        girl.inputEnabled = true;
        girl.anchor.x = girl.anchor.y = 0.5;
        girl.events.onInputDown.add(this.handleActorClick, this);
        this.setUpHeroPhysics(girl);
        girl.width = girl.height = 150;

        this.stage.backgroundColor = "#4488AA";
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 500;
        this.setUpHeroPhysics(hero);

        bg.events.onInputDown.add(this.walk, this);

        [pizza, tv, bookcase].forEach((sprite: Phaser.Sprite) => {
            sprite.inputEnabled = true;
            sprite.events.onInputDown.add(room.handleWallSpriteClick, room);
        });
    }

    private handleWallSpriteClick(this: Room, wallSprite: Phaser.Sprite) {
        const hero = this.hero;
        this.cancelWalkingTween();

        this.game.debug.spriteBounds(wallSprite);
        this.walkingTween = this.walkSpriteTowardsPoint(this.hero, new Point(wallSprite.position.x + wallSprite.width / 2, wallSprite.position.y));
        this.walkingTween.start();
        if (wallSprite.position.y === 0) {
            this.walkingTween.onComplete.add(() => {
                hero.body.velocity.y = -1000;
            });
        }
    }

    private jumpSpriteTowardsPoint(sprite: Phaser.Sprite, point: Phaser.Point): Phaser.Tween {
        const yDiff = sprite.y - point.y;
        const yDistance = Math.abs(yDiff);
        const duration: number = (yDistance / 200) * 500;

        return this.game.add.tween(sprite).to({y: point.y}, duration);
    }

    private walkSpriteTowardsPoint(sprite: Phaser.Sprite, point: Phaser.Point): Phaser.Tween {
        const xDiff = sprite.x - point.x;
        const xDistance = Math.abs(xDiff);
        const duration: number = (xDistance / 200) * 1000;

        if (xDiff > 0) {
            sprite.scale.x = -Math.abs(sprite.scale.x);
        } else if (xDiff < 0) {
            sprite.scale.x = Math.abs(sprite.scale.x);
        }
        const tween = this.game.add.tween(sprite).to({x: point.x}, duration);
        tween.onStart.add(() => {
            sprite.animations.play('walk');
        });
        tween.onComplete.add(() => {
            sprite.animations.play('idle');
        });
        return tween;
    }

    private handleActorClick(sprite: Phaser.Sprite, pointer: Phaser.Pointer) {
        this.cancelWalkingTween();

        const tween = this.walkSpriteTowardsPoint(this.hero, new Point(sprite.position.x + sprite.width + 10, sprite.position.y));
        tween.onComplete.add(() => {
            this.hero.scale.x = -Math.abs(sprite.scale.x);
        });
        tween.start();

        this.walkingTween = tween;
    }

    private walk(stage: Phaser.Sprite, pointer: Phaser.Pointer) {
        this.cancelWalkingTween();
        this.walkingTween = this.walkSpriteTowardsPoint(this.hero, pointer.position).start();
    }

    private cancelWalkingTween() {
        if (this.walkingTween !== undefined) {
            this.walkingTween.stop();
        }
    }

    private getBookcase(): Phaser.Sprite {
        const bookcase = this.add.sprite(320, 0, 'sprites', 'bookcase_square');
        bookcase.name = 'bookcase';
        bookcase.width = 320;
        bookcase.height = 320;
        return bookcase;
    }

    private enableEditor() {
        const changes: { [name: string]: Point; } = {};

        this.world.children.forEach((child: Phaser.Sprite) => {
            child.inputEnabled = true;
            child.input.enableDrag();
            child.events.onDragStart.add(onDragStart, this);
            child.events.onDragStop.add(onDragStop, this);
        });

        function onDragStart(sprite: Phaser.Sprite, pointer: Phaser.Pointer) {
        }

        function onDragStop(sprite: Phaser.Sprite, pointer: Phaser.Pointer) {
            changes[sprite.name] = sprite.position;
            console.log(changes);
        }
    }

    private setUpHeroPhysics(hero: Phaser.Sprite): void {
        this.physics.enable(hero);
        hero.body.collideWorldBounds = true;
        hero.body.bounce.y = 0.3;
    }

    update() {
    }

    render() {
        //this.game.debug.body(this.girl);
        //this.game.debug.body(this.hero);
        //this.game.debug.bodyInfo(this.getHero(),0,0);
        //this.game.debug.body(this.getRoomLayer());
    }

    private getHero(): Phaser.Sprite {
        if (this.hero === undefined) {
            const hero = this.hero = this.add.sprite(250, 0, 'sprites', 'blue_square_guy_0');
            hero.name = 'hero';

            hero.width = hero.height = 150;

            hero.anchor.x = 0.5;
            hero.anchor.y = 0.5;

            hero.animations.add('idle', ['blue_square_guy_0', 'blue_square_guy_1'], 0.5, true);
            hero.animations.add('walk', ['blue_square_guy_0', 'blue_square_guy_1'], 8, true);
        }
        return this.hero;
    }
}
