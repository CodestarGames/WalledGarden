import { Application, Container, Graphics, Text } from 'pixi.js';
import { SceneManagerSingleton } from '@/utils/SceneManagerSingleton.ts';
import { IScene } from '@scenes/Types.ts';
import { textStyles } from '@/constants.ts';
import { MenuScene } from '@scenes/MenuScene.ts';

// Base scene that all scenes inherit from
export abstract class BaseScene implements IScene {
    public container: Container;
    public app: Application;
    public backBtn: Graphics | undefined;

    abstract init(): void | Promise<void>;

    abstract update(delta: number): void;

    abstract destroy(): void;

    abstract resize(screenWidth: number, screenHeight: number): void;

    // creates back button used in all child scenes
    public createBackButton(): void {
        const button = new Graphics()
            .beginFill(0xffffff)
            .drawRoundedRect(0, 0, 96, 80, 15)
            .endFill()
            .beginFill(0x25a525)
            .drawRoundedRect(8, 8, 80, 66, 15)
            .endFill();

        button.x = this.app.screen.width - button.width - 32;
        button.y = 8;

        const buttonText = new Text('< back', textStyles.BUTTON);

        buttonText.x = button.width / 2 - buttonText.width / 2;
        buttonText.y = button.height / 2 - buttonText.height / 2;

        button.addChild(buttonText);
        button.interactive = true;
        button.on('pointerdown', () => {
            this.sceneManager.changeScene(MenuScene);
            this.backBtn?.destroy();
        });
        button.on('mouseenter', () => {
            button.y -= 4;
        });
        button.on('mouseleave', () => {
            button.y += 4;
        });

        this.container.addChild(button);
        this.backBtn = button;
    }

    protected constructor() {
        this.app = SceneManagerSingleton.getInstance().app;
        this.container = new Container();
    }

    public get sceneManager(): SceneManagerSingleton {
        return SceneManagerSingleton.getInstance();
    }
}
