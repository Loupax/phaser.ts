import Humanoid from "../Humanoid";
import GameState from "../GameState";
import Tv from "../Objects/Tv";
import ActionEnum from "../Actions/ActionEnum";


class ActionHandler {
    private isReading = false;
    private isWatchingTv = false;
    private watchTvFulfillmentIncreaseLoop: Phaser.TimerEvent;
    private readingFulfillmentIncreaseLoop: Phaser.TimerEvent;

    watchTv(guy: Humanoid, tv: Tv, gameState: GameState) {
        guy.play('sitting_back');

        if(this.isWatchingTv === false){
            const tvStartup = tv.play('starting');
            tvStartup.onComplete.add(() => {
                tv.play('playing');
                this.watchTvFulfillmentIncreaseLoop = guy.game.time.events.loop(Phaser.Timer.SECOND, () => {
                    gameState.addFulfillment(tv.action);
                });
            });
            this.isWatchingTv = true;
        }
    }


    feed(who: Humanoid, gameState: GameState) {
        who.play('eat');
        gameState.addFulfillment(ActionEnum.Pizza);
    }

    readABook(who: Humanoid, gameState: GameState) {

        if(this.isReading === true){
            return;
        }
        this.isReading = true;
        who.play('reading');
        this.readingFulfillmentIncreaseLoop = who.game.time.events.loop(Phaser.Timer.SECOND, () => {
            gameState.addFulfillment(ActionEnum.Reading);
        });
    }

    stopReading(who: Phaser.Sprite) {
        if (this.isReading === true) {
            who.game.time.events.remove(this.readingFulfillmentIncreaseLoop);
        }
        this.isReading = false;
    }

    shutDownTv(tv: Phaser.Sprite) {
        if (this.isWatchingTv === true) {
            tv.play('shutting_down').onComplete.add(() => {
                tv.play('off');
            });

            tv.game.time.events.remove(this.watchTvFulfillmentIncreaseLoop);
        }
        this.isWatchingTv = false;
    }

    getIntimate(who: Phaser.Sprite, gameState: GameState) {
        gameState.addFulfillment(ActionEnum.Intimacy);
    }
}

export default new ActionHandler();
