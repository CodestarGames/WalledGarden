import { Graphics, Text, Assets } from 'pixi.js';

import { assetManifest } from '@/assets';
import { textStyles, preloaderLayout } from '../constants';
import { MenuScene } from '@scenes/MenuScene';
import { BaseScene } from '@scenes/BaseScene.ts';

// Scene responsible for preloading assets
export class PreloaderScene extends BaseScene {
    private loadingBar: Graphics | null = null;
    private loadingText: Text | null = null;
    private readonly BAR_WIDTH = 320;
    private readonly BAR_HEIGHT = 32;

    constructor() {
        super();
        this.setupUI();
    }

    private setupUI(): void {
        const bgBar = new Graphics();
        bgBar.beginFill(0x333333);

        bgBar.drawRect(0, 0, this.BAR_WIDTH, this.BAR_HEIGHT);
        bgBar.endFill();
        bgBar.x = -this.BAR_WIDTH / 2;
        bgBar.y = 0;
        this.container.addChild(bgBar);

        this.loadingBar = new Graphics();
        this.loadingBar.x = -this.BAR_WIDTH / 2;
        this.loadingBar.y = 0;
        this.container.addChild(this.loadingBar);

        this.loadingText = new Text('Loading... 0%', textStyles.LOADING_TEXT);
        this.loadingText.anchor.set(0.5, 0);
        this.loadingText.x = 0;
        this.loadingText.y = this.BAR_HEIGHT + preloaderLayout.TEXT_OFFSET_Y;
        this.container.addChild(this.loadingText);
    }

    public updateProgress(progress: number): void {
        const fillWidth = this.BAR_WIDTH * progress;

        if (this.loadingBar) {
            this.loadingBar.clear();
            this.loadingBar.beginFill(0x00ff00);
            this.loadingBar.drawRect(0, 0, fillWidth, this.BAR_HEIGHT);
            this.loadingBar.endFill();
        }

        if (this.loadingText) {
            this.loadingText.text = `Loading... ${Math.round(progress * 100)}%`;
        }
    }

    public async init(): Promise<void> {
        this.updateProgress(0);

        try {
            await Assets.init({ manifest: assetManifest });
            await Assets.loadBundle('main', (progress) => {
                this.updateProgress(progress);
            });
            this.sceneManager.changeScene(MenuScene);
        } catch (error) {
            console.error('Error loading assets:', error);
            if (this.loadingText) this.loadingText.text = 'Error loading assets!';
        }
    }

    public update(_delta: number): void {}

    public destroy(): void {
        this.loadingBar = null;
        this.loadingText = null;
    }

    public resize(screenWidth: number, screenHeight: number): void {
        this.container.x = screenWidth / 2;
        this.container.y = screenHeight / 2;
    }
}
