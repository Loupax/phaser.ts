import * as Phaser from 'phaser';
import Point = Phaser.Point;

export default class Room extends Phaser.State{
    roomLayer: Phaser.TilemapLayer;
    hero: Phaser.Sprite;
    girl: Phaser.Sprite;

    preload() {
        console.log('Preload');
        this.load.atlasJSONHash('sprites', 'img/sprite.png', 'img/sprite.json');

    }

    create() {

        const bg = this.add.sprite(0, 0, this.add.bitmapData(this.game.width, this.game.height));
        bg.inputEnabled = true;

        const bookcase = this.getBookcase();
        const tv = this.add.sprite(320, 320, 'sprites', 'square_tv_screen');
        tv.width = 320;
        tv.height = 320;
        const hero = this.getHero();
        const girl = this.girl = this.add.sprite(4, 589, 'sprites', 'square_girl_0');
        girl.inputEnabled = true;
        girl.anchor.x = girl.anchor.y = 0.5;
        girl.events.onInputDown.add(this.handleObjectClick, this);
        this.setUpHeroPhysics(girl);
        girl.width = girl.height = 150;

        this.stage.backgroundColor = "#4488AA";
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 500;
        this.setUpHeroPhysics(hero);

        bg.events.onInputDown.add(this.walk, this);

        //this.enableEditor();
    }

    private walkSpriteTowardsPoint(sprite: Phaser.Sprite, point: Phaser.Point){
        const xDistance = Math.abs(sprite.x - point.x);
        const duration:number = (Math.abs(xDistance)/200) * 1000;

        if(sprite.x - point.x > 0){
            sprite.scale.x = -Math.abs(sprite.scale.x);

        } else{
            sprite.scale.x = Math.abs(sprite.scale.x);
        }
        this.game.add.tween(sprite).to( { x: point.x }, duration).start();
    }

    private handleObjectClick(sprite:Phaser.Sprite, pointer: Phaser.Pointer){
        this.walkSpriteTowardsPoint(this.hero, new Point(sprite.position.x + sprite.width + 10, sprite.position.y));
    }

    private walk(stage:Phaser.Sprite, pointer: Phaser.Pointer){
        this.walkSpriteTowardsPoint(this.hero, pointer.position);
    }

    private getBookcase():Phaser.Sprite{
        const bookcase = this.add.sprite(320, 0, 'sprites', 'bookcase_square');
        bookcase.name = 'bookcase';
        bookcase.width = 320;
        bookcase.height = 320;
        return bookcase;
    }

    private enableEditor(){
        const changes: { [name: string]: Point; } = { };

        this.world.children.forEach((child: Phaser.Sprite)=>{
            child.inputEnabled = true;
            child.input.enableDrag();
            child.events.onDragStart.add(onDragStart, this);
            child.events.onDragStop.add(onDragStop, this);
        });

        function onDragStart(sprite: Phaser.Sprite, pointer:Phaser.Pointer){}
        function onDragStop(sprite: Phaser.Sprite, pointer:Phaser.Pointer){
            changes[sprite.name] = sprite.position;
            console.log(changes);
        }
    }

    private setUpHeroPhysics(hero:Phaser.Sprite):void{
        this.physics.enable(hero);
        hero.body.collideWorldBounds = true;
        hero.body.bounce.y = 0.3;
    }

    update(){}

    render(){
        //this.game.debug.body(this.girl);
        //this.game.debug.body(this.hero);
        //this.game.debug.bodyInfo(this.getHero(),0,0);
        //this.game.debug.body(this.getRoomLayer());
    }

    private getHero(): Phaser.Sprite {
        if (this.hero === undefined) {
            const hero = this.hero = this.add.sprite(250, 0, 'sprites', 'blue_square_guy_0');
            hero.width = hero.height = 150;
            hero.name = 'hero';
            hero.anchor.x = 0.5;
            hero.anchor.y = 0.5;
        }
        return this.hero;
    }
}
