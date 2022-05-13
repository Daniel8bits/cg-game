import Vec3 from "./Vec3"
import Mat4 from "./Mat4"

class Transform {

    private _translation: Vec3;
    private _rotation: Vec3;
    private _scale: Vec3;

    public constructor(translation: Vec3, rotation: Vec3, scale: Vec3) {
        this._translation = translation ?? new Vec3(0, 0, 0);
        this._rotation = rotation ?? new Vec3(0, 0, 0)
        this._scale = scale ?? new Vec3(0, 0, 0)
    }
    
    public getTranslation() : Vec3 {
        return this._translation
    }

    public setTranslation(translation: Vec3) {
        this._translation = translation
    }

    public getRotation() : Vec3 {
        return this._rotation
    }

    public setRotation(rotation: Vec3) {
        this._rotation = rotation
    }

    public getScale() : Vec3 {
        return this._scale
    }

    public setScale(scale: Vec3) {
        this._scale = scale
    }

    public toMatrix() : Mat4 {
        return Mat4.transform(this._translation, this._rotation, this._scale)
    }
    

}

export default Transform