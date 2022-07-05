import {Vector3, Matrix4} from "@math.gl/core"
import Orientation from "@razor/math/Orientation"
import { toRadians } from "@razor/math/math"
import Transform from "../math/Transform"

class Camera {

    private _transform: Transform
    
    private static _mainCamera : Camera;

    public constructor(translation: Vector3, rotation: Orientation) {
        this._transform = new Transform(translation, rotation)
        Camera._mainCamera = this;
    }

    public static get Main() : Camera{
        return this._mainCamera;
    }

    public static setMainCamera(camera: Camera){
        this._mainCamera = camera;
    }

    public getTransform() : Transform {
        return this._transform
    }

    public getView(): Matrix4 {
        
        const translation = new Matrix4()
            .translate(this._transform.getTranslation()
            .add(this._transform.getLocalTransform().translation).negate());

        const euler = this._transform.getRotation()

        const rotationX = new Matrix4().rotateX(toRadians(euler.pitch))
        const rotationY = new Matrix4().rotateY(toRadians(euler.yaw))
        const rotationZ = new Matrix4().rotateZ(toRadians(euler.roll))

        const rotation = rotationZ.multiplyRight(rotationY.multiplyRight(rotationX))

        return translation.multiplyRight(rotation).invert()

    }

}

export default Camera