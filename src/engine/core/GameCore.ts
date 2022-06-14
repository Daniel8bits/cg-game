import SceneManager from './scenes/SceneManager'
import RenderStrategy from '../renderer/RenderStrategy'
import Scene from './scenes/Scene';

abstract class GameCore {

    private _sceneManager: SceneManager;
    
    protected constructor() {
        this._sceneManager = new SceneManager();
    }

    public abstract start(): void;

    public changeScene(scene : Scene) : void{

    }

    public update(time: number, delta: number): void {
        this._sceneManager.update(time, delta);
    }

    public render(): void {
        this._sceneManager.render();
    }

    public setScene(scene : string | Scene) : SceneManager{
        const sceneManager = this._sceneManager.setActive(scene);
        this.changeScene(sceneManager.getActive());
        return sceneManager;
    }

    public getSceneManager(): SceneManager {
        return this._sceneManager;
    }

}

export default GameCore;