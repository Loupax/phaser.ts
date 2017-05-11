import Humanoid from "../Humanoid";
import GameState from "../GameState";
import Tv from "../Objects/Tv";
import ActionEnum from "../Actions/ActionEnum";


class ActionHandler {
    private watchTvFulfillmentIncreaseLoop: Phaser.TimerEvent;
    private readingFulfillmentIncreaseLoop: Phaser.TimerEvent;

    watchTv(guy: Humanoid, tv: Tv, gameState: GameState) {
        guy.play('sitting_back');

        if (tv.animations.currentAnim.name === 'off') {
            const tvStartup = tv.play('starting');
            tvStartup.onComplete.add(() => {
                const watchTvAnimation = tv.play('playing');
                this.watchTvFulfillmentIncreaseLoop = guy.game.time.events.loop(Phaser.Timer.SECOND, () => {

                    gameState.addFulfillment(tv.action);

                });
            });
        }
    }

    feed(who: Humanoid, gameState: GameState) {
        who.play('eat');
        gameState.addFulfillment(ActionEnum.Pizza);
    }

    readABook(who: Humanoid, gameState: GameState) {
        const anim = who.play('reading');

        this.readingFulfillmentIncreaseLoop = who.game.time.events.loop(Phaser.Timer.SECOND, () => {

            gameState.addFulfillment(ActionEnum.Reading);

        });
    }

    stopReading(who: Phaser.Sprite) {
        if (who.animations.currentAnim.name !== 'off') {
            who.game.time.events.remove(this.readingFulfillmentIncreaseLoop);
        }
    }

    shutDownTv(tv: Phaser.Sprite) {
        if (tv.animations.currentAnim.name !== 'off') {
            tv.play('shutting_down').onComplete.add(() => {
                tv.play('off');
            });

            tv.game.time.events.remove(this.watchTvFulfillmentIncreaseLoop);
        }
    }

    getIntimate(who: Phaser.Sprite, gameState: GameState) {
        gameState.addFulfillment(ActionEnum.Intimacy);
    }
}

export default new ActionHandler();
