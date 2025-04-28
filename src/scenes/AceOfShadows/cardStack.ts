// class representing a stack of cards
import { aceOfShadowsConf } from '@/constants.ts';
import { Container, Point, Sprite } from 'pixi.js';
import { gsap } from 'gsap';

export class CardStack {
    private readonly CARD_HEIGHT = aceOfShadowsConf.CARD_HEIGHT;
    private readonly CARD_WIDTH = aceOfShadowsConf.CARD_WIDTH;
    private readonly STACK_OFFSET_Y = aceOfShadowsConf.STACK_OFFSET_Y;

    private list: Sprite[] = [];
    public position: Point = new Point(0, 0);
    private parentContainer: Container;

    public constructor(parentContainer: Container, slots: number, fill: boolean, position: Point) {
        this.parentContainer = parentContainer;
        this.initSlots(slots, fill, position);
    }

    public popTopCard() {
        let item = this.list.pop();
        if (item) return item;

        return null;
    }

    public pushCardToStack(card: Sprite) {
        this.list.push(card);
    }

    private initSlots(slots: number, fill: boolean, position: Point) {
        if (fill) {
            for (let i = 0; i < slots; i++) {
                this.createCardSprite(i);
            }
        }
        this.position = position;
    }

    private createCardSprite(index: number): void {
        const card = Sprite.from('card');
        card.width = this.CARD_WIDTH;
        card.height = this.CARD_HEIGHT;
        card.name = `card_${index}`;
        card.anchor.set(0.5);
        this.list.push(card);
        this.parentContainer.addChild(card);
    }

    public arrangeStack() {
        this.list.reverse().forEach((card, index) => {
            if (card.destroyed || gsap.isTweening(card)) return;

            card.x = this.position.x;
            card.y = this.position.y - index * this.STACK_OFFSET_Y;
            card.zIndex = index;
        });
    }

    public getTopZ(): number {
        return this.list.length;
    }
}
