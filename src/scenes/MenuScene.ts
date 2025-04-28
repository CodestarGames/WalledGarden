import { Graphics, Text } from 'pixi.js';

import { menuSceneLayout, textStyles } from '../constants';
import { PhoenixFlameScene } from '@scenes/PhoenixFlame';
import { MagicWordsScene } from '@scenes/MagicWords';
import { AceOfShadowsScene } from '@scenes/AceOfShadows';
import { SceneConstructor } from '@scenes/Types.ts';
import { BaseScene } from '@scenes/BaseScene.ts';

//Scene responsible for ui navigation
export class MenuScene extends BaseScene {
    private titleText: Text | null = null;
    private buttons: any[] = [];
    private resizeListener: (() => void) | null = null;

    private readonly buttonConfigs: { label: string; sceneKey: SceneConstructor }[] = [
        { label: 'Phoenix Flame', sceneKey: PhoenixFlameScene },
        { label: 'Magic Words', sceneKey: MagicWordsScene },
        { label: 'Ace of Shadows', sceneKey: AceOfShadowsScene },
    ];

    constructor() {
        super();
    }

    public init(): void {
        this.setupUI();
    }

    public update(_delta: number): void {}

    public destroy(): void {
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
            this.resizeListener = null;
        }

        this.titleText?.destroy();

        this.buttons = [];
        this.container.destroy({ children: true });
    }

    private setupUI(): void {
        this.titleText = new Text('Select a Scene!', textStyles.SCENE_TITLE);
        this.titleText.anchor.set(0.5);
        this.container.addChild(this.titleText);

        this.buttonConfigs.forEach((config) => {
            const button = this.createMenuButton(config.label, 0, () => {
                this.sceneManager.changeScene(config.sceneKey);
            });
            button.zIndex = 10;
            this.buttons.push(button);
            this.container.addChild(button);
        });
    }

    private createMenuButton(textStr: string, y: number, onClick: () => void): Graphics {
        const button = new Graphics()
            .beginFill(0xffffff)
            .drawRoundedRect(0, 0, 400, 80, 15)
            .endFill()
            .beginFill(0x25a525)
            .drawRoundedRect(8, 8, 384, 64, 15);

        button.x = this.app.screen.width / 2 - button.width / 2;
        button.y = y;

        const buttonText = new Text(textStr, textStyles.BUTTON);

        buttonText.x = button.width / 2 - buttonText.width / 2;
        buttonText.y = button.height / 2 - buttonText.height / 2;

        button.addChild(buttonText);
        button.interactive = true;
        button.on('pointerdown', onClick);
        button.on('mouseenter', () => {
            button.y -= 4;
        });
        button.on('mouseleave', () => {
            button.y += 4;
        });

        return button;
    }

    public resize(appWidth: number, appHeight: number): void {
        if (this.titleText) {
            this.titleText.x = appWidth / 2;
            this.titleText.y = appHeight * menuSceneLayout.TITLE_Y_FACTOR;
        }

        const totalButtonHeight = this.buttons.length * 64 + Math.max(0, this.buttons.length - 1) * 64;
        const titleBottom = this.titleText ? this.titleText.y + this.titleText.height / 2 : 0;
        let currentY = titleBottom + totalButtonHeight / 2;

        for (const button of this.buttons) {
            button.x = appWidth / 2 - button.width / 2;
            button.y = currentY;
            currentY += button.height + 64;
        }
    }
}
