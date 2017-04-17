import * as Phaser from 'phaser';
import Point = Phaser.Point;

export default class Room extends Phaser.State{
    roomLayer: Phaser.TilemapLayer;
    hero: Phaser.Sprite;

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
        const girl = this.add.sprite(4, 589, 'sprites', 'square_girl_0');
        girl.inputEnabled = true;
        girl.events.onInputDown.add(this.handleObjectClick);
        this.setUpHeroPhysics(girl);
        girl.width = girl.height = 50;

        this.stage.backgroundColor = "#4488AA";
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 500;
        this.setUpHeroPhysics(hero);

        bg.events.onInputDown.add(this.walk, this.hero);

        //this.enableEditor();
    }

    private handleObjectClick(sprite:Phaser.Sprite, pointer: Phaser.Pointer){
        //console.log('Object click', arguments);
    }

    private walk(this:Phaser.Sprite, stage:Phaser.Sprite, pointer: Phaser.Pointer){
        const distance = Phaser.Point.distance(this, pointer);
        const duration:number = (Math.abs(distance)/200) * 1000;
        pointer.game.add.tween(this).to( { x: pointer.position.x - this.width/2 }, duration).start();
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
        //this.game.debug.body(this.getHero());
        //this.game.debug.bodyInfo(this.getHero(),0,0);
        //this.game.debug.body(this.getRoomLayer());
    }

    private getRoomLayer(): Phaser.TilemapLayer {
        if (this.roomLayer === undefined) {
            let roomData = [
                `1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1`,
                `1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1`,
                `1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1`,
                `1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1`,
                `1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1`,
                `1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1`,
                `1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1`,
                `1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1`,
                `1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1`,
                `1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1`,
                `1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1`,
                `1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1`
            ].join('\n');

            this.cache.addTilemap('roomMap', null, roomData, Phaser.Tilemap.CSV);

            const map = this.add.tilemap('roomMap',16, 16);
            const bmd = this.add.bitmapData(32,16);
            bmd.context.fillRect(16,0,16,16);
            map.addTilesetImage('sci_fi_tiles', bmd, 16, 16);
            map.setCollision(1);
            const layer = this.roomLayer = map.createLayer(0);
            layer.name = 'layer';
        }
        return this.roomLayer;
    }

    private getHero(): Phaser.Sprite {
        if (this.hero === undefined) {
            const hero = this.hero = this.add.sprite(112, 0, 'sprites', 'blue_square_guy_0');
            hero.width = hero.height = 50;
            hero.name = 'hero';
        }
        return this.hero;
    }
}
