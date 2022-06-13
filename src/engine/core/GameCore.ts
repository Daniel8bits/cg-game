import SceneManager from './scenes/SceneManager'
import RenderStrategy from '../renderer/RenderStrategy'

abstract class GameCore {

    private _sceneManager: SceneManager;
    
    protected constructor() {
        this._sceneManager = new SceneManager();
    }

    public abstract start(): void;

    public update(time: number, delta: number): void {
        this._sceneManager.update(time, delta);
    }

    public render(): void {
        this._sceneManager.render();
    }

    public getSceneManager(): SceneManager {
        return this._sceneManager;
    }

}

export default GameCore;