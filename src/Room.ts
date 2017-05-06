import * as Phaser from "phaser";
import Humanoid from "./Humanoid";
import SpriteFactory from "./SpriteFactory";
import Actions from "./Actions";
import GameState from "./GameState";
import FulfillmentBlock from "./FulfillmentBlock";
import {FulfillmentBarSprite} from "./FulfillmentBarSprite";
import Point = Phaser.Point;

type wallSpriteClickHandler = [Phaser.Sprite, (what: Phaser.Sprite) => void];
export default class Room extends Phaser.State {

    walkingTween: Phaser.Tween;
    hero: Humanoid;
    audio: Phaser.AudioSprite;
    wallSpriteClickHandlers: Array<wallSpriteClickHandler>;
    activeWallSprite: Phaser.Sprite;
    gameState: GameState;

    private static getXDistance(from: Phaser.Point, to: Phaser.Point): number {
        const xDiff = from.x - to.x;
        return Math.abs(xDiff);
    }

    init() {
        const fulfillment: Array<FulfillmentBlock> = [];
        for (let i = 0; i < 4; i++) {
            fulfillment.push(new FulfillmentBlock(10));
        }
        this.gameState = new GameState(10, fulfillment);
    }

    preload() {
        this.load.atlasJSONHash('sprites', 'img/sprite.png', 'img/sprite.json');
        this.load.audiosprite('sfx',
            [
                'snd/sprite.mp3',
                'snd/sprite.ogg',
                'snd/sprite.m4a',
                'snd/sprite.ac3',
            ],
            'snd/sprite.json'
        );
    }

    create() {
        this.stage.backgroundColor = "#4488AA";
        this.audio = this.add.audioSprite('sfx');
        const factory = new SpriteFactory(this.game);
        const bg = factory.transparentBg();

        const wallObjects = this.add.group();

        const pizza = factory.pizza(0, 0);
        const bookcase = factory.bookcase(320, 0);

        const tv = factory.tv(320, 320);
        const girl = factory.girl(4, 589);
        this.hero = factory.hero(250, 589);

        wallObjects.inputEnableChildren = true;
        wallObjects.onChildInputDown.add(this.handleWallSpriteClick, this);
        wallObjects.addMultiple([pizza, bookcase, tv]);

        const group = this.add.existing(new FulfillmentBarSprite(this.game));
        group.x = 0;
        group.y = 0;
        group.init(this.gameState.getFulfillment(), this.gameState.getMaxFulfillment());

        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 2000;


        girl.events.onInputDown.add(this.handleActorClick, this);
        bg.events.onInputDown.add(this.walk, this);

        // When the user clicks anywhere but the TV, the TV should shutdown
        // Must find a more scaleable way to do it at some point...
        [pizza, bookcase, girl, bg].forEach((sprite: Phaser.Sprite) => {
            sprite.events.onInputDown.add(() => {
                Actions.shutDownTv(tv);
            });
        });
        this.wallSpriteClickHandlers = [
            [tv, (tv): void => {
                Actions.watchTv(this.hero, tv, this.gameState);
            }],
            [pizza, (pizza): void => {
                Actions.feed(this.hero, this.gameState);
            }],
            [bookcase, (bookcase): void => {
                Actions.readABook(this.hero, this.gameState);
            }]
        ];

        this.game.time.events.loop(Phaser.Timer.SECOND * 1000, this.timeMarchesByFor, this.gameState);

        this.game.onPause.add(this.onPause, this.gameState);
        this.game.onResume.add(this.onResume, this.gameState);
    }

    timeMarchesByFor(this: GameState): void {
        this.consumeFulfillment();
    }

    onPause(this: GameState) {
        this.timeOfMostRecentPause = new Date();
        console.log('Paused!');
    }

    onResume(this: GameState) {
        const now = new Date();
        this.toConsumeOnNextCycle = (now.getTime() - this.timeOfMostRecentPause.getTime()) / 1000;
        console.log('Unpaused after ' + this.toConsumeOnNextCycle + ' seconds');
    }

    update() {
        if (this.hero.justTouchedTheFloor()) {
            this.audio.play('land');
        }

        if (this.hero.isJumping() && this.hero.justReachedJumpPeak()) {
            this.runWallSpriteClickHandler();
        }
    }

    render() {
        //this.game.debug.body(this.girl);
        //this.game.debug.body(this.hero);
        //this.game.debug.bodyInfo(this.getHero(),0,0);
        //this.game.debug.body(this.getRoomLayer());
    }

    private runWallSpriteClickHandler(): void {
        const tuple = this.wallSpriteClickHandlers.filter((tuple: wallSpriteClickHandler): boolean => {
            return tuple[0] === this.activeWallSprite;
        }).pop();

        tuple[1](tuple[0]);
    }

    private handleWallSpriteClick(this: Room, wallSprite: Phaser.Sprite) {
        if (!this.hero.body.onFloor()) {
            return;
        }

        this.activeWallSprite = wallSprite;
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
                hero.jump();
            });
        } else {
            this.walkingTween.onComplete.add(() => {
                this.runWallSpriteClickHandler();
            });
        }
    }

    private walkSpriteTowardsPoint(sprite: Phaser.Sprite, point: Phaser.Point): Phaser.Tween {
        const xDiff = sprite.x - point.x;
        const xDistance = Room.getXDistance(sprite.position, point);
        const duration: number = (xDistance / 2000) * 1000;

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
