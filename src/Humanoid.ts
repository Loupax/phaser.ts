import * as Phaser from "phaser";

export default class Humanoid extends Phaser.Sprite implements AffectedByGravityInterface, JumperInterface {
    private _isFalling = false;
    private _goingUp = false;
    private _reachedJumpPeak = false;
    private _isJumping = false;

    isFalling(): boolean {
        return this._isFalling;
    }

    isJumping() {
        return this._isJumping;
    }

    update() {
        this.fallHandling();
        this.handleJumpPeakDetection();
    }

    jump() {
        this.body.velocity.y = -2000;
        this._isJumping = true;
    }

    justTouchedTheFloor() {
        return this.body.onFloor() && this.isFalling()
    }

    justReachedJumpPeak(): boolean {
        return this._reachedJumpPeak;
    }

    private fallHandling(): void {
        const onFloor = this.body.onFloor();

        if (onFloor && this._isJumping) {
            this._isJumping = false;
        }

        if (onFloor && this._isFalling) {
            this._isFalling = false;
        }

        if (this.body.velocity.y > 0) {
            this._isFalling = true;
        }
    }

    private handleJumpPeakDetection(): void {
        if (this._reachedJumpPeak === true) {
            this._reachedJumpPeak = false;
        }
        if (this.body.velocity.y < 0) {
            this._goingUp = true;
            this._reachedJumpPeak = false;
        } else {
            if (this._goingUp === true) {
                this._reachedJumpPeak = true;
            }
            this._goingUp = false;
        }
    }
}