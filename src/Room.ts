import * as Phaser from 'phaser';
import Humanoid from './Humanoid';
import Point = Phaser.Point;
import SpriteFactory from "./SpriteFactory";

export default class Room extends Phaser.State {

    walkingTween: Phaser.Tween;
    hero: Humanoid;
    audio: Phaser.AudioSprite;

    preload() {
        this.load.atlasJSONHash('sprites', 'img/sprite.png', 'img/sprite.json');
        this.load.audiosprite('sfx', ['snd/sprite.ogg', 'snd/sprite.m4a', 'snd/sprite.ac3', 'snd/sprite.mp4'], 'snd/sprite.json');
    }

    create() {
        this.stage.backgroundColor = "#4488AA";
        this.audio = this.add.audioSprite('sfx');
        const factory = new SpriteFactory(this.game);
        const room = this;
        const bg = factory.transparentBg();
        const pizza = factory.pizza(0, 0);
        const bookcase = factory.bookcase(320, 0);
        const tv = factory.tv(320, 320);
        this.hero = factory.hero(250, 0);
        const girl = factory.girl(4, 589);


        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 500;


        girl.events.onInputDown.add(this.handleActorClick, this);
        bg.events.onInputDown.add(this.walk, this);
        [pizza, tv, bookcase].forEach((sprite: Phaser.Sprite) => {
            sprite.inputEnabled = true;
            sprite.events.onInputDown.add(room.handleWallSpriteClick, room);
        });
    }

    update() {
        if (this.hero.justTouchedTheFloor()) {
            this.audio.play('land');
        }
    }

    render() {
        //this.game.debug.body(this.girl);
        //this.game.debug.body(this.hero);
        //this.game.debug.bodyInfo(this.getHero(),0,0);
        //this.game.debug.body(this.getRoomLayer());
    }

    private handleWallSpriteClick(this: Room, wallSprite: Phaser.Sprite) {
        const hero = this.hero;
        const audio = this.audio;
        this.cancelWalkingTween();

        this.game.debug.spriteBounds(wallSprite);
        this.walkingTween = this.walkSpriteTowardsPoint(
            this.hero,
            new Point(wallSprite.position.x + wallSprite.width / 2, wallSprite.position.y)
        );

        this.walkingTween.start();
        if (wallSprite.position.y === 0) {
            this.walkingTween.onComplete.add(() => {
                audio.play('jump');
                hero.body.velocity.y = -650;
            });
        }
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
}
