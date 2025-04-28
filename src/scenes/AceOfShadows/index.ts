import { Point } from 'pixi.js';

import { gsap } from 'gsap';
import { aceOfShadowsConf } from '@/constants';
import { degreesToRadians } from '@/utils/mathUtils.ts';
import { BaseScene } from '@scenes/BaseScene.ts';
import { CardStack } from '@scenes/AceOfShadows/cardStack.ts';

export class AceOfShadowsScene extends BaseScene {
    private readonly NUM_CARDS = aceOfShadowsConf.NUM_CARDS;
    private readonly MOVE_INTERVAL = aceOfShadowsConf.MOVE_INTERVAL;

    private moveTimer = 0;
    private activeTweens: gsap.core.Animation[] = [];
    private deckPool: CardStack;

    private slots: CardStack[] = [];

    constructor() {
        super();
        this.container.sortableChildren = true;

        this.deckPool = new CardStack(this.container, this.NUM_CARDS, true, new Point());

        this.slots.push(new CardStack(this.container, this.NUM_CARDS, false, new Point()));
        this.slots.push(new CardStack(this.container, this.NUM_CARDS, false, new Point()));
        this.slots.push(new CardStack(this.container, this.NUM_CARDS, false, new Point()));
    }

    public init(): void {
        this.moveTimer = this.MOVE_INTERVAL;
        this.activeTweens = [];

        this.createBackButton();

        this.resize(this.sceneManager.app.renderer.width, this.sceneManager.app.renderer.height);

        this.deckPool.arrangeStack();
    }

    private positionStacks(screenWidth: number, screenHeight: number): void {
        const centerX = screenWidth / 2;
        const centerY = screenHeight / 2;
        const spacing = aceOfShadowsConf.CARD_WIDTH * aceOfShadowsConf.STACK_X_SPACING_FACTOR;

        const totalStackOffsetY = (this.NUM_CARDS - 1) * aceOfShadowsConf.STACK_OFFSET_Y;
        const verticalOffset = totalStackOffsetY / 2;

        let deckPos: Point = new Point();
        deckPos.x = centerX + spacing * 1.5;
        deckPos.y = centerY + verticalOffset;

        this.deckPool.position = deckPos;
        this.deckPool.arrangeStack();

        this.slots.forEach((slot, index) => {
            let pos: Point = new Point();
            pos.x = deckPos.x - spacing * (index + 1);
            pos.y = centerY + verticalOffset;
            slot.position = pos;
            slot.arrangeStack();
        });
    }

    private moveCardToStack(slot: CardStack): void {
        let cardToMove = this.deckPool.popTopCard();

        if (cardToMove) {
            slot.pushCardToStack(cardToMove);
            cardToMove.zIndex = 1000;
            const tween = gsap.timeline();
            tween.to(cardToMove, {
                y: cardToMove.position.y - 48,
                duration: 1,
                ease: 'expo.out',
            });
            tween.to(cardToMove, {
                x: slot.position.x,
                y: slot.position.y - slot.getTopZ() * aceOfShadowsConf.STACK_OFFSET_Y,
                rotation: degreesToRadians(-360 * 6),
                duration: 1,
                ease: 'power2.out',
                onComplete: () => {
                    cardToMove.zIndex = slot.getTopZ();
                    cardToMove.rotation = 0;
                    this.activeTweens = this.activeTweens.filter((t) => t !== tween);
                },
            });

            this.activeTweens.push(tween);
        }
    }

    public update(delta: number): void {
        this.moveTimer += delta;
        if (this.moveTimer >= this.MOVE_INTERVAL) {
            this.moveTimer -= this.MOVE_INTERVAL;
            let item = this.slots[Math.floor(Math.random() * this.slots.length)];
            this.moveCardToStack(item);
        }
    }

    public destroy(): void {
        this.activeTweens.forEach((tween) => {
            tween.kill();
        });
        this.activeTweens = [];
        this.container.removeChildren();
    }

    public resize(screenWidth: number, screenHeight: number): void {
        if (this.backBtn) {
            this.backBtn.x = screenWidth - this.backBtn.width - 32;
        }

        this.positionStacks(screenWidth, screenHeight);
    }
}
