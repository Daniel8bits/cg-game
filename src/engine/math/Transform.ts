import Orientation from "./Orientation"
import {Vector3, Pose, Euler, Matrix4} from "@math.gl/core"
import { toRadians } from "./math";
import Scene from "@razor/core/scenes/Scene";
import Entity from "@razor/core/entities/Entity";
import TransformStruct from "./TransformStruct";

class Transform {

    private _entity : Entity;
    private _globalTransform: TransformStruct
    private _localTransform: TransformStruct
    private _children : Scene;
    private _parent : Transform;

    public constructor(translation?: Vector3, rotation?: Orientation, scale?: Vector3) {
        this._globalTransform = new TransformStruct(translation, rotation, scale)
        this._localTransform = new TransformStruct()
    }
    
    public setEntity(entity : Entity){
        this._entity = entity;
        this._children = new Scene(entity.getName()+"_children");
    }

    public get children() : Scene{
        return this._children;
    }

    public set parent(parent : Transform) {
        //entity.getTransform().children.add(this._entity);
        this._parent = parent;
    }

    public get parent(){
        return this._parent;
    }
    
    public getTranslation() : Vector3 {
        return new Vector3(
            this._globalTransform.translation.x, 
            this._globalTransform.translation.y, 
            this._globalTransform.translation.z
        )
    }

    public setTranslation(translation: Vector3) {
        this._globalTransform.translation.x = translation.x
        this._globalTransform.translation.y = translation.y
        this._globalTransform.translation.z = translation.z
    }

    public setX(x: number) {
        this._globalTransform.translation.x = x
    }
    public setY(y: number) {
        this._globalTransform.translation.y = y
    }
    public setZ(z: number) {
        this._globalTransform.translation.z = z
    }
    public getX(): number {
        return this._globalTransform.translation.x
    }
    public getY(): number {
        return this._globalTransform.translation.y
    }
    public getZ(): number {
        return this._globalTransform.translation.z
    }

    public getRotation() : Orientation {
        return new Orientation(this._globalTransform.rotation.pitch, this._globalTransform.rotation.yaw, this._globalTransform.rotation.roll)
    }

    public setRotation(rotation: Orientation) {
        this._fixRotation(rotation.pitch, (v) => {this._globalTransform.rotation.pitch = v})
        this._fixRotation(rotation.yaw, (v) => {this._globalTransform.rotation.yaw = v})
        this._fixRotation(rotation.roll, (v) => {this._globalTransform.rotation.roll = v})
    }

    public setPitch(pitch: number) {
        this._fixRotation(pitch, (v) => {this._globalTransform.rotation.pitch = v})
    }
    public setYaw(yaw: number) {
        this._fixRotation(yaw, (v) => {this._globalTransform.rotation.yaw = v})
    }
    public setRoll(roll: number) {
        this._fixRotation(roll, (v) => {this._globalTransform.rotation.roll = v})
    }
    public getPitch(): number {
        return this._globalTransform.rotation.pitch
    }
    public getYaw(): number {
        return this._globalTransform.rotation.yaw
    }
    public getRoll(): number {
        return this._globalTransform.rotation.roll
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
        return new Vector3(this._globalTransform.scale.x, this._globalTransform.scale.y, this._globalTransform.scale.z)
    }

    public setScale(scale: Vector3) {
        this._globalTransform.scale = scale
    }

    public toMatrix(): Matrix4 {
        return this._globalTransform.toMatrix().multiplyRight(
            this._localTransform.toMatrix()
        )
    }

    public toMatrixIgnoringZ(): Matrix4 {
        return this._globalTransform.toMatrixIgnoringZ().multiplyRight(
            this._localTransform.toMatrixIgnoringZ()
        )
    }

    public toInversePositionMatrix() : Matrix4 {
        return this._globalTransform.toInversePositionMatrix().multiplyRight(
            this._localTransform.toInversePositionMatrix()
        )
    }

    public worldMatrix() : Matrix4{
        const localMatrix = this.toMatrix();
        let worldMatrix = localMatrix.clone();
        if(this._parent){
            worldMatrix = this._parent.worldMatrix().multiplyRight(localMatrix);
        }
        return worldMatrix;
    }

    public worldMatrixIgnoringZ() : Matrix4{
        const localMatrix = this.toMatrixIgnoringZ();
        let worldMatrix = localMatrix.clone();
        if(this._parent){
            worldMatrix = this._parent.worldMatrixIgnoringZ().multiplyRight(localMatrix);
        }
        return worldMatrix;
    }

    public worldMatrixFrom(transform: Transform): Matrix4 {
        const translation = new Matrix4().translate(transform.getTranslation());

        const rotationX = new Matrix4().rotateX(toRadians(transform.getPitch()))
        const rotationY = new Matrix4().rotateY(toRadians(transform.getYaw()))
        const rotationZ = new Matrix4().rotateZ(toRadians(transform.getRoll()))

        const rotation = rotationX.multiplyRight(rotationY.multiplyRight(rotationZ))

        const scale = new Matrix4().scale(transform.getScale());

        return translation.multiplyRight(rotation.multiplyRight(scale))
    }
    
    public worldTranslation(): Vector3 {
        let worldTranslation = this._globalTransform.translation.clone().add(
                this._localTransform.translation)
        if(this._parent){
            worldTranslation = this._parent.worldTranslation().add(worldTranslation);
        }
        return worldTranslation;
    }

    public getLocalTransform(): TransformStruct {
        return this._localTransform
    }

}

export default Transform