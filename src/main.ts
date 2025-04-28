import './style.css';

import { Application } from 'pixi.js';
import { initDevtools } from '@pixi/devtools';

import { SceneManagerSingleton } from '@/utils/SceneManagerSingleton.ts';
import { PreloaderScene } from '@scenes/PreloaderScene';

import { Stats } from 'pixi-stats';

// Sets up application and dev tools
(async () => {
    const app = new Application<HTMLCanvasElement>({
        background: '#000080',
        resizeTo: window,
        antialias: true,
    });
    document.body.appendChild(app.view);
    initDevtools({ app });

    app.ticker.add(() => {
        sceneManager.update(app.ticker.deltaMS);
    });

    app.renderer.on('resize', () => {
        sceneManager.resize();
    });
    app.start();

    const sceneManager = SceneManagerSingleton.getInstance(app);

    sceneManager.changeScene(PreloaderScene);

    // @ts-ignore
    const stats = new Stats(app.renderer);
})();
