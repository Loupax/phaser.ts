import Humanoid from "./Humanoid";
import GameState from "./GameState";
import FulfillmentBlock from "./FulfillmentBlock";
class ActionHandler {
    private watchTvFulfillmentIncreaseLoop: Phaser.TimerEvent;

    watchTv(guy: Humanoid, tv: Phaser.Sprite, gameState: GameState) {
        guy.play('sitting_back');

        if (tv.animations.currentAnim.name === 'off') {
            const tvStartup = tv.play('starting');
            tvStartup.onComplete.add(() => {
                const watchTvAnimation = tv.play('playing');
                this.watchTvFulfillmentIncreaseLoop = guy.game.time.events.loop(Phaser.Timer.SECOND, () => {
                    gameState.addFulfillment(new FulfillmentBlock(1));
                });
            });
        }
    }

    feed(who: Humanoid, gameState: GameState) {
        who.play('eat');
        gameState.addFulfillment(new FulfillmentBlock(5));
    }

    readABook(who: Humanoid, gameState: GameState) {
        const anim = who.play('reading');
        gameState.addFulfillment(new FulfillmentBlock(10));
    }

    shutDownTv(tv: Phaser.Sprite) {
        if (tv.animations.currentAnim.name !== 'off') {
            tv.play('shutting_down').onComplete.add(() => {
                tv.play('off');
            });

            tv.game.time.events.remove(this.watchTvFulfillmentIncreaseLoop);
        }
    }
}

export default new ActionHandler();
