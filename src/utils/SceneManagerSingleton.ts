import { Application } from 'pixi.js';

import { IScene, SceneConstructor } from '@scenes/Types.ts';

// Singleton class that manages scenes
export class SceneManagerSingleton {
    private static instance: SceneManagerSingleton;

    public app: Application;
    private currentScene: IScene | null = null;

    private constructor(app: Application) {
        this.app = app;
    }
    static getInstance(app?: Application): SceneManagerSingleton {
        if (this.instance) {
            return this.instance;
        }
        if (app) this.instance = new SceneManagerSingleton(app);
        return this.instance;
    }

    public changeScene(NewSceneClass: SceneConstructor): void {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene.container);
            this.currentScene.destroy();
            this.currentScene = null;
        }

        this.currentScene = new NewSceneClass();
        if (this.currentScene) {
            this.app.stage.addChild(this.currentScene.container);

            this.currentScene.init();
            this.resize();
        }
    }

    public update(delta: number): void {
        this.currentScene?.update(delta);
    }

    public resize(): void {
        this.currentScene?.resize(this.app.renderer.width, this.app.renderer.height);
    }
}
