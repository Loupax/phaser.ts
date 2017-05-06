import FulfillmentBlock from "./FulfillmentBlock";
export class FulfillmentBarSprite extends Phaser.Group {
    private fulfillment: Array<FulfillmentBlock>;
    private maxFulfillment: number;

    private fgColor: Phaser.Sprite;

    init(fulfillment: Array<FulfillmentBlock>, maxFulfillment: number) {
        this.fulfillment = fulfillment;
        this.maxFulfillment = maxFulfillment;

        const bgBmd = this.createHealthbarBitmapdata('#000000', this.game.width, 20);

        const bg = this.create(this.x, this.y, bgBmd);

        const fgBmd = this.createHealthbarBitmapdata('#00ff00', this.game.width - 2, 20 - 2);
        this.fgColor = this.create(this.x + 1, this.y + 1, fgBmd);


    }

    update() {
        this.fgColor.scale.x = this.fulfillment.length / this.maxFulfillment;
    }

    private createHealthbarBitmapdata(color: string, width: number, height: number): Phaser.BitmapData {
        const fgBmd = this.game.add.bitmapData(width, height);
        fgBmd.ctx.beginPath();
        fgBmd.ctx.rect(0, 0, width, height);
        fgBmd.ctx.fillStyle = color;
        fgBmd.ctx.fill();
        return fgBmd;

    }
}
