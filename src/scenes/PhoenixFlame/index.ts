import { Container, Sprite } from 'pixi.js';

import { BaseScene } from '@scenes/BaseScene.ts';
import { Emitter, upgradeConfig } from '@barvynkoa/particle-emitter';
import { flameEmitterConf } from '@/constants.ts';

export class PhoenixFlameScene extends BaseScene {
    private flameEmitter: Emitter | null = null;
    private fireContainer: Container | null = null;
    private candleSprite: Sprite | null = null;

    constructor() {
        super();
    }

    public async init(): Promise<void> {
        this.createBackButton();
        this.fireContainer = new Container();
        this.container.addChild(this.fireContainer);

        this.flameEmitter = new Emitter(this.fireContainer, upgradeConfig(flameEmitterConf, ['fireParticle']));

        this.candleSprite = Sprite.from('candle');
        this.fireContainer.addChild(this.candleSprite);
        this.candleSprite.position.x = -this.candleSprite.width / 2 + 6;
        this.candleSprite.position.y = -this.candleSprite.height / 4 + 72;

        this.flameEmitter.emit = true;

        this.resize(this.sceneManager['app'].renderer.width, this.sceneManager['app'].renderer.height);
    }

    public update(delta: number): void {
        const deltaSeconds = delta / 1000;

        if (this.flameEmitter) {
            this.flameEmitter.update(deltaSeconds);
        }
    }

    public destroy(): void {}

    public resize(screenWidth: number, screenHeight: number): void {
        if (this.fireContainer) {
            this.fireContainer.x = screenWidth / 2;
            this.fireContainer.y = screenHeight / 2;
        }
        if (this.backBtn) {
            this.backBtn.x = screenWidth - this.backBtn.width - 32;
        }
    }
}
