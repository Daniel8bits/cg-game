import GLUtils, { gl } from '../gl/GLUtils';
import GameCore from './GameCore';
import GameLoop from './GameLoop';
import InputManager from './InputManager';

/**
 * Canvas management class
 */
class Razor {
    private _gameLoop: GameLoop;
    private _canvas: HTMLCanvasElement;

    public constructor(gameCore: GameCore) {
        this._canvas = GLUtils.init();
        this.resize();
        gl.clearColor(0, 0, 0, 1);
        this._gameLoop = new GameLoop(gameCore);  
    }

    public start() : void {
        //this.lockMouse()
        InputManager.init()
        this._gameLoop.start();
    }

    public resize() : void {
        if(this._canvas === undefined) {
            throw new Error('Canvas was not initialized!');
        }

        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
        gl.viewport(0, 0, this._canvas.width, this._canvas.height);
    }

    private lockMouse() {
        window.addEventListener("keyup", (e: KeyboardEvent) => {
            if(e.code === 'Escape') {
                document.exitPointerLock()
            } 
        })
        this._canvas.addEventListener('click', (e: MouseEvent) => {
            this._canvas.requestPointerLock()
        })
    }
}

export default Razor;
