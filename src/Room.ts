import * as Phaser from "phaser";
import Humanoid from "./Humanoid";
import SpriteFactory from "./SpriteFactory";
import Actions from "./Actions/Actions";
import GameState from "./GameState";
import Tv from "./Objects/Tv";
import {FulfillmentBarSprite} from "./FulfillmentBarSprite";
import Point = Phaser.Point;


export default class Room extends Phaser.State {

    walkingTween: Phaser.Tween;
    hero: Humanoid;
    audio: Phaser.AudioSprite;
    wallSpriteClickHandlers: Map<Phaser.Sprite, (what: Phaser.Sprite) => void>;
    activeWallSprite: Phaser.Sprite;
    gameState: GameState;
    private fulfilmentBarSprite: FulfillmentBarSprite;

    private static getXDistance(from: Phaser.Point, to: Phaser.Point): number {
        const xDiff = from.x - to.x;
        return Math.abs(xDiff);
    }

    init() {
        this.gameState = new GameState(10, []);
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
        girl.inputEnabled = true;
        this.hero = factory.hero(250, 589);

        wallObjects.inputEnableChildren = true;
        wallObjects.onChildInputDown.add(this.handleWallSpriteClick, this);
        wallObjects.addMultiple([pizza, bookcase, tv]);
        this.fulfilmentBarSprite = new FulfillmentBarSprite(this.game);

        const group = this.add.existing(this.fulfilmentBarSprite);
        group.x = 0;
        group.y = 0;
        group.init(this.gameState.getFulfillment(), this.gameState.getMaxFulfillment());

        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 0;
        this.hero.body.gravity.y = 2000;


        girl.events.onInputDown.add(this.handleActorClick, this);
        bg.events.onInputDown.add(this.walk, this);

        // When the user clicks anywhere but the TV, the TV should shutdown
        // Must find a more scaleable way to do it at some point...
        [pizza, bookcase, girl, bg].forEach((sprite: Phaser.Sprite) => {
            sprite.events.onInputDown.add(() => {
                Actions.shutDownTv(tv);
            });
        });

        // When the user clicks anywhere but the TV, the TV should shutdown
        // Must find a more scaleable way to do it at some point...
        [pizza, tv, girl, bg].forEach((sprite: Phaser.Sprite) => {
            sprite.events.onInputDown.add(() => {
                Actions.stopReading(this.hero);
            });
        });

        this.wallSpriteClickHandlers = new Map<Phaser.Sprite, (what: Phaser.Sprite) => void>();
        this.wallSpriteClickHandlers.set(tv, (tv: Tv): void => {
            Actions.watchTv(this.hero, tv, this.gameState);
        });

        this.wallSpriteClickHandlers.set(pizza, (pizza: Phaser.Sprite): void => {
            Actions.feed(this.hero, this.gameState);
        });

        this.wallSpriteClickHandlers.set(bookcase, (bookcase: Phaser.Sprite): void => {
            Actions.readABook(this.hero, this.gameState);
        });

        girl.events.onInputDown.add(() => {
            Actions.getIntimate(this.hero, this.gameState);
        });

        // Handle loading before setting the timer.
        this.onResume();
        this.game.time.events.loop(Phaser.Timer.SECOND, this.timeMarchesByFor, this);

        this.game.onPause.add(this.onPause, this);
        this.game.onResume.add(this.onResume, this);
    }

    timeMarchesByFor(this: Room): void {
        const consumed = this.gameState.consumeFulfillment();
        const fontSize = 15;
        const style = {font: `${fontSize}px Arial`, fill: "#ff0044"};

        if (consumed > 0) {
            const text = this.game.add.text(0, 0, `-${consumed}`, style);
            text.anchor.setTo(0.5);
            text.stroke = '#f00';
            text.strokeThickness = 2;
            text.fill = '#fff';

            const textSprite = this.game.add.sprite((this.game.width * this.fulfilmentBarSprite.percentageFilled()) - fontSize / 2, 0);
            textSprite.addChild(text);

            this.game.physics.enable(textSprite);
            textSprite.body.gravity.y = 100;
            textSprite.body.velocity.x = 10;
        }
    }

    onPause() {
        // Gamestate Pause must be called at the beggining of the handler so that any changes
        // made by the gamestate.pause method are also saved in localstorage
        this.gameState.pause();

        const saveObject = this.gameState.serialize();
        localStorage.setItem('save', JSON.stringify({
            gameState:saveObject,
            hero: {
                x: this.hero.x,
                y: this.hero.y,
            }
        }));
    }

    onResume() {
        if(localStorage.getItem('save') === null){
            this.gameState.resume();
            return;
        }

        const savedObject = JSON.parse(localStorage.getItem('save'));

        this.gameState.unserialize(savedObject.gameState);
        this.hero.x = savedObject.hero.x;
        this.hero.y = savedObject.hero.y;

        // On the other hand gameState.resume() must run at the end of the resume handler so that
        // it takes the loaded data into account
        this.gameState.resume();
    }

    update() {

        if (this.hero.justTouchedTheFloor()) {
            this.audio.play('land');
        }

        if (this.hero.isJumping() && this.hero.justReachedJumpPeak()) {
            this.runWallSpriteClickHandler();
        }
    }

    private runWallSpriteClickHandler(): void {
        this.wallSpriteClickHandlers.get(this.activeWallSprite)(this.activeWallSprite);
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
        }
    }
}
