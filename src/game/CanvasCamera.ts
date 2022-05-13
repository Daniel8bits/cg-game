import Camera from "../engine/core/Camera";
import InputManager, {Keys} from "../engine/core/InputManager";
import { toRadian } from "../engine/math/math";
import Vec3 from "../engine/math/Vec3";


class CanvasCamera extends Camera {

    private _currentMousePosition: Vec3
    private _previousMousePosition: Vec3

    private _speed: number
    private _sensitivity: number

    public constructor() {
        super(new Vec3(), new Vec3())
        this._currentMousePosition = new Vec3()
        this._previousMousePosition = new Vec3()
        this._speed = 5
        this._sensitivity = 7.5
    }

    public update(delta: number) {

        this._currentMousePosition.x = InputManager.getMouseX();
        this._currentMousePosition.y = InputManager.getMouseY();

        const x = Math.sin(toRadian(this.getTransform().getRotation().y)) * this._speed * delta;
        const z = Math.cos(toRadian(this.getTransform().getRotation().y)) * this._speed * delta;

        if(InputManager.isKeyPressed(Keys.KEY_W)){ // FRONT
            this.getTransform().getTranslation().x += -x;
            this.getTransform().getTranslation().z += -z;
        }

        if(InputManager.isKeyPressed(Keys.KEY_S)){ // BACK
            this.getTransform().getTranslation().x += x;
            this.getTransform().getTranslation().z += z;
        }

        if(InputManager.isKeyPressed(Keys.KEY_A)){ // LEFT
            this.getTransform().getTranslation().x += -z;
            this.getTransform().getTranslation().z += x;
        }

        if(InputManager.isKeyPressed(Keys.KEY_D)){ // RIGHT
            this.getTransform().getTranslation().x += z;
            this.getTransform().getTranslation().z += -x;
        }

        if(InputManager.isKeyPressed(Keys.KEY_SPACE)){ // UP
            this.getTransform().getTranslation().y += this._speed * delta;
        }

        if(InputManager.isKeyPressed(Keys.KEY_SHIFT_L)){ // DOWN
            this.getTransform().getTranslation().y += -this._speed * delta;
        }

        if(InputManager.isMouseLeft()) {
            const dx = this._currentMousePosition.x - this._previousMousePosition.x;
            const dy = this._currentMousePosition.y - this._previousMousePosition.y;
    
            this.getTransform().setRotation(
                this.getTransform().getRotation().sum(new Vec3(
                    dy * this._sensitivity * delta, 
                    dx * this._sensitivity * delta,
                    0
                ))
            )
        }

        this._previousMousePosition.assign(this._currentMousePosition);

    }
}

export default CanvasCamera