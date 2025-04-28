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

    // full screen button builder
    public createFullScreenButton(): void {
        let isFullscreen = !!document.fullscreenElement;
        const fullscreenButton = new Graphics()
            .beginFill(0xffffff)
            .drawRoundedRect(0, 0, 136, 80, 15)
            .endFill()
            .beginFill(0x25a525)
            .drawRoundedRect(8, 8, 120, 66, 15)
            .endFill();

        fullscreenButton.x = this.app.screen.width - fullscreenButton.width - 32;
        fullscreenButton.y = 8;

        const buttonText = new Text(isFullscreen ? 'Windowed' : 'Fullscreen', textStyles.BUTTON);

        buttonText.x = fullscreenButton.width / 2 - buttonText.width / 2;
        buttonText.y = fullscreenButton.height / 2 - buttonText.height / 2;

        fullscreenButton.addChild(buttonText);
        fullscreenButton.interactive = true;
        fullscreenButton.on('pointerdown', () => {
            toggleFullscreen();
        });
        fullscreenButton.on('mouseenter', () => {
            fullscreenButton.y -= 4;
        });
        fullscreenButton.on('mouseleave', () => {
            fullscreenButton.y += 4;
        });

        this.container.addChild(fullscreenButton);

        function updateFullscreenButtonText() {
            isFullscreen = !!document.fullscreenElement;
            buttonText.text = isFullscreen ? 'Windowed' : 'Fullscreen';
        }

        async function toggleFullscreen() {
            if (!document.fullscreenElement) {
                {
                    await document.documentElement.requestFullscreen();
                    isFullscreen = true;
                }
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                    isFullscreen = false;
                }
            }
            updateFullscreenButtonText();
        }

        document.addEventListener('fullscreenchange', updateFullscreenButtonText);
    }

    protected constructor() {
        this.app = SceneManagerSingleton.getInstance().app;
        this.container = new Container();
    }

    public get sceneManager(): SceneManagerSingleton {
        return SceneManagerSingleton.getInstance();
    }
}
