import ActionEnum from "../Actions/ActionEnum";
import InterractableInterface from "../Interfaces/InterractableInterface";
export default class Tv extends Phaser.Sprite implements InterractableInterface{

    public readonly action = ActionEnum.VideoGames;

    public static make(game: Phaser.Game, x:number, y:number){
        const tv = game.add.sprite(x, y, 'sprites', 'tv_off');

        tv.animations.add(
            'off',
            ['tv_off'],
            1,
            false
        );

        tv.animations.add(
            'starting', [
                'tv_starting_0',
                'tv_starting_1',
                'tv_starting_2',
                'tv_starting_3',
                'tv_starting_4',
                'tv_starting_5',
                'tv_starting_6',
            ],
            8,
            false
        );

        tv.animations.add(
            'shutting_down', [
                'tv_starting_6',
                'tv_starting_5',
                'tv_starting_4',
                'tv_starting_3',
                'tv_starting_2',
                'tv_starting_1',
                'tv_starting_0',
            ],
            16,
            false
        );

        tv.animations.add(
            'playing',
            [
                'tv_playing_0',
                'tv_playing_1'
            ],
            8,
            true
        );

        tv.animations.play('off');
        return tv;
    }
}