import Vec3 from "./Vec3"
import Orientation from "./Orientation"
import {Vector3, Pose, Euler, Matrix4} from "@math.gl/core"
import { toRadians } from "./math";
import Scene from "@razor/core/Scene";
import Entity from "@razor/core/Entity";

class Transform {

    private _entity : Entity;
    private _translation: Vector3;
    private _rotation: Orientation;
    private _scale: Vector3;
    private _children : Scene;
    private _parent : Entity;

    public constructor(translation?: Vector3, rotation?: Orientation, scale?: Vector3) {
        this._translation = translation ?? new Vector3()
        this._rotation = rotation ?? new Orientation()
        this._scale = scale ?? new Vector3(1, 1, 1)
        
    }
    
    public setEntity(entity : Entity){
        this._entity = entity;
        this._children = new Scene(entity.getName()+"_children");
    }

    public get children() : Scene{
        return this._children;
    }

    public set parent(entity : Entity) {
        //entity.getTransform().children.add(this._entity);
        this._parent = entity;
    }

    public get parent(){
        return this._parent;
    }
    
    public getTranslation() : Vector3 {
        return new Vector3(
            this._translation.x, 
            this._translation.y, 
            this._translation.z
        )
    }

    public setTranslation(translation: Vector3) {
        this._translation.x = translation.x
        this._translation.y = translation.y
        this._translation.z = translation.z
    }

    public setX(x: number) {
        this._translation.x = x
    }
    public setY(y: number) {
        this._translation.y = y
    }
    public setZ(z: number) {
        this._translation.z = z
    }
    public getX(): number {
        return this._translation.x
    }
    public getY(): number {
        return this._translation.y
    }
    public getZ(): number {
        return this._translation.z
    }

    public getRotation() : Orientation {
        return new Orientation(this._rotation.pitch, this._rotation.yaw, this._rotation.roll)
    }

    public setRotation(rotation: Orientation) {
        this._fixRotation(rotation.pitch, (v) => {this._rotation.pitch = v})
        this._fixRotation(rotation.yaw, (v) => {this._rotation.yaw = v})
        this._fixRotation(rotation.roll, (v) => {this._rotation.roll = v})
    }

    public setPitch(pitch: number) {
        this._fixRotation(pitch, (v) => {this._rotation.pitch = v})
    }
    public setYaw(yaw: number) {
        this._fixRotation(yaw, (v) => {this._rotation.yaw = v})
    }
    public setRoll(roll: number) {
        this._fixRotation(roll, (v) => {this._rotation.roll = v})
    }
    public getPitch(): number {
        return this._rotation.pitch
    }
    public getYaw(): number {
        return this._rotation.yaw
    }
    public getRoll(): number {
        return this._rotation.roll
    }

    private _fixRotation(v: number, set: (v: number) => void): void {
        if(v >= 360) {
            v %= 360
            v -= 360
        }
        if(v <= -360) {
            v %= 360
            v += 360
        }
        set(v)
    }

    public getScale() : Vector3 {
        return new Vector3(this._scale.x, this._scale.y, this._scale.z)
    }

    public setScale(scale: Vector3) {
        this._scale = scale
    }

    public toMatrix() : Matrix4 {

        const translation = new Matrix4().translate(this._translation.clone().negate());

        //const rotation = new Matrix4().fromQuaternion(this._rotation);
        //const rotation = this._rotation.getRotationMatrix();
        

        const rotationX = new Matrix4().rotateX(toRadians(this._rotation.pitch))
        const rotationY = new Matrix4().rotateY(toRadians(this._rotation.yaw))
        const rotationZ = new Matrix4().rotateZ(toRadians(this._rotation.roll))

        const rotation = rotationX.multiplyRight(rotationY.multiplyRight(rotationZ))

        const scale = new Matrix4().scale(this._scale);

        return translation.multiplyRight(rotation.multiplyRight(scale))
        //return scale.multiplyRight(this._pose.getTransformationMatrix())
    }

    public worldMatrix() : Matrix4{
        const localMatrix = this.toMatrix();
        let worldMatrix = localMatrix.clone();
        if(this.parent){
            worldMatrix = this.parent.getTransform().worldMatrix().multiplyRight(localMatrix);
        }
        return worldMatrix;
    }
    

}

/*
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
        return new Vec3(this._translation.x, this._translation.y, this._translation.z)
    }

    public setTranslation(translation: Vec3) {
        this._translation.assign(translation)
    }

    public getRotation() : Vec3 {
        return new Vec3(this._rotation.x, this._rotation.y, this._rotation.z)
    }

    public setRotation(rotation: Vec3) {
        this._fixRotation(rotation.x, (v) => {this._rotation.x = v})
        this._fixRotation(rotation.y, (v) => {this._rotation.y = v})
        this._fixRotation(rotation.z, (v) => {this._rotation.z = v})
    }

    private _fixRotation(v: number, set: (v: number) => void): void {
        if(v >= 360) {
            v %= 360
            v -= 360
        }
        if(v <= -360) {
            v %= 360
            v += 360
        }
        set(v)
    }

    public getScale() : Vec3 {
        return new Vec3(this._scale.x, this._scale.y, this._scale.z)
    }

    public setScale(scale: Vec3) {
        this._scale.assign(scale)
    }

    public toMatrix() : Mat4 {
        return Mat4.transform(this._translation, this._rotation, this._scale)
    }
    

}
*/

export default Transform