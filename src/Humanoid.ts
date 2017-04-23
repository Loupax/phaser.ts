import * as Phaser from 'phaser';

export default class Humanoid extends Phaser.Sprite implements  AffectedByGravityInterface{
    private _isFalling = false;
    isFalling(): boolean {
        return this._isFalling;
    }

    update(){
        if (this.body.onFloor() && this._isFalling) {
            this._isFalling = false;
        }

        if (this.body.velocity.y > 0) {
            this._isFalling = true;
        }
    }

    justTouchedTheFloor(){
        return this.body.onFloor() && this.isFalling()
    }


}