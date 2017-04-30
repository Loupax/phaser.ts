import Humanoid from "./Humanoid";
class ActionHandler{
    watchTv(guy:Humanoid, tv:Phaser.Sprite){
        guy.play('sitting_back');
        if(tv.animations.currentAnim.name === 'off') {
            tv.play('starting').onComplete.add(() => {
                tv.play('playing');
            });
        }
    }

    shutDownTv(tv: Phaser.Sprite){
        if(tv.animations.currentAnim.name !== 'off'){
            tv.play('shutting_down').onComplete.add(()=>{
                tv.play('off');
            });
        }
    }
}

export default new ActionHandler();
