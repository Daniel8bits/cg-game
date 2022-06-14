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

    /* 
    
    public static view(translation: Vec3, rotation: Vec3): Mat4 {

        const TRANSLATION = Mat4.translate(new Vec3(-translation.x, -translation.y, -translation.z));

        const ROTATION_X = Mat4.xRotate(rotation.x);
        const ROTATION_Y = Mat4.yRotate(rotation.y);
        const ROTATION_Z = Mat4.zRotate(rotation.z);

        return TRANSLATION.mult(ROTATION_Y.mult(ROTATION_X).mult(ROTATION_Z))
    }
    
    */

    public getView(): Matrix4 {
        
        const translation = new Matrix4()
            .translate(this._transform.getTranslation().negate());
        //const rotation = new Matrix4().fromQuaternion(this._transform.getRotation());


        const euler = this._transform.getRotation()

        const rotationX = new Matrix4().rotateX(toRadians(euler.pitch))
        const rotationY = new Matrix4().rotateY(toRadians(euler.yaw))
        const rotationZ = new Matrix4().rotateZ(toRadians(euler.roll))

        const rotation = rotationZ.multiplyRight(rotationY.multiplyRight(rotationX))

        return translation.multiplyRight(rotation).invert()
        

        //return this._transform.toMatrix()

    }

}

export default Camera