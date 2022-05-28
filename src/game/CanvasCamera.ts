import {Vector3, Euler} from "@math.gl/core"

import Entity from "../engine/core/entities/Entity";
import Razor from "../engine/core/Razor";
//import SceneManager from "@engine/core/SceneManager";
import Orientation from "@razor/math/Orientation";
import Transform from "../engine/math/Transform";
import Camera from "../engine/core/Camera";
import InputManager, {Keys} from "../engine/core/InputManager";
import { toRadians } from "../engine/math/math";
//import CameraManager from "./CameraManager";
import SimpleEntity from "./entities/SimpleEntity";
import GameTest from "./GameTest";


class CanvasCamera extends Camera {

    public static readonly MODE = {
        FIRST_PERSON: 0,
        THIRD_PERSON: 1,
    }
    
    private _name: string

    private _speed: number
    private _sensitivity: number
    private _pitch: number
    private _angleAround: number
    
    private _lockedIn: Entity
    private _mode: number
    private _lookAt: boolean


    public constructor(
        name: string,
        translation: Vector3 = new Vector3,
        rotation : Orientation = new Orientation
    ) {
        super(translation, rotation)
        this._name = name
        this._speed = 40
        this._sensitivity = 7.5
        this._pitch = 0
        this._lockedIn = null
        this._mode = CanvasCamera.MODE.FIRST_PERSON
        this._lookAt = false
        this._angleAround = 0
    }

    public update(delta: number) {
        if(this._mode === CanvasCamera.MODE.FIRST_PERSON && GameTest.getInstance().getSceneManager().getActive().getName() != "menu") {
            this._firstPersonMovement(delta)
        }
/*
        if(this._mode === CanvasCamera.MODE.THIRD_PERSON) {
            this._thirdPersonMovement(delta)
        }
*/
    }

    private _firstPersonMovement(delta: number): void {

        const x = Math.sin(toRadians(this.getTransform().getRotation().y)) * this._speed * delta;
        const z = Math.cos(toRadians(this.getTransform().getRotation().y)) * this._speed * delta;

        if(InputManager.isKeyPressed(Keys.KEY_W)){ // FRONT
            const translation = this.getTransform().getTranslation()
            translation.x += x;
            translation.z += z;
            this.getTransform().setTranslation(translation)
        }

        if(InputManager.isKeyPressed(Keys.KEY_S)){ // BACK
            const translation = this.getTransform().getTranslation()
            translation.x += -x;
            translation.z += -z;
            this.getTransform().setTranslation(translation)
        }

        if(InputManager.isKeyPressed(Keys.KEY_A)){ // LEFT
            const translation = this.getTransform().getTranslation()
            translation.x += z;
            translation.z += -x;
            this.getTransform().setTranslation(translation)
        }

        if(InputManager.isKeyPressed(Keys.KEY_D)){ // RIGHT
            const translation = this.getTransform().getTranslation()
            translation.x += -z;
            translation.z += x;
            this.getTransform().setTranslation(translation)
        }

        if(InputManager.isKeyPressed(Keys.KEY_SPACE)){ // UP
            const translation = this.getTransform().getTranslation()
            translation.y += -this._speed * delta;
            this.getTransform().setTranslation(translation)
        }

        if(InputManager.isKeyPressed(Keys.KEY_C)){ // DOWN
            const translation = this.getTransform().getTranslation()
            translation.y += this._speed * delta;
            this.getTransform().setTranslation(translation)
        }

        if(InputManager.isMouseLeft()) {
            const dx = InputManager.getMouseDX() 
            const dy = InputManager.getMouseDY() 

            const rotation = this.getTransform().getRotation()
            this.getTransform().setPitch(rotation.pitch + dy * this._sensitivity * delta)
            this.getTransform().setYaw(rotation.yaw + dx * this._sensitivity * delta)

            //console.log(rotation);
        /*
            this.getTransform().setRotation(new Euler(
                rotation.yaw + dy * this._sensitivity * delta,
                rotation.pitch + dx * this._sensitivity * delta,
                rotation.roll
            ))
            
            this.getTransform().setRotation(
                this.getTransform().getRotation().sum(new Vector3(
                    dy * this._sensitivity * delta, 
                    dx * this._sensitivity * delta,
                    0
                ))
            )
    */
        }
        

    }
/*
    private _thirdPersonMovement(delta: number): void {

        if(InputManager.isMouseLeft()) {
            this._angleAround -= InputManager.getMouseDX() * this._sensitivity*2 * delta
            this._pitch -= InputManager.getMouseDY() * this._sensitivity*2 * delta
            if(this._pitch > 45) {
                this._pitch = 45
            }
            else if(this._pitch < -45) {
                this._pitch = -45
            }
        }

        const horizontalDistance = 10 * Math.cos(toRadian(this._pitch))
        const verticalDistance = 10 * Math.sin(toRadian(this._pitch))
        const theta = this._lockedIn.getTransform().getRotation().y + this._angleAround
        const offsetX = horizontalDistance * Math.sin(toRadian(theta))
        const offsetZ = horizontalDistance * Math.cos(toRadian(theta))
        const entityTranslation = this._lockedIn.getTransform().getTranslation()

        
        this.getTransform().setTranslation(new Vector3(
            (entityTranslation.x + offsetX) * -1,
            (entityTranslation.y - verticalDistance) * -1,
            (entityTranslation.z + offsetZ) * -1
        ))

        if(InputManager.isMouseLeft()) { // MOUSE
            this.getTransform().setRotation(new Quaternion(
                -this._pitch,
                180+theta
            ))
        }

    }
/*
    public lock(entity: Entity): void {
        this._lockedIn = entity
        this._mode = CanvasCamera.MODE.FIRST_PERSON

        if(entity) {
            this._mode = CanvasCamera.MODE.THIRD_PERSON
            const translation = entity.getTransform().getTranslation()
            translation.x *= -1
            translation.z += 10
            this.getTransform().setTranslation(translation)
            this.getTransform().setRotation(new Vec3())
            this._angleAround = 180;
        }
        
    }
*/
/*
    public getView(): Mat4 {
        return Mat4.view(
            this.getTransform().getTranslation(),
            this.getTransform().getRotation(),
        )
    }
*/
    public getLockedIn(): Entity {
        return this._lockedIn
    }

    public setLookAt(shouldLookAt: boolean): void {
        this._lookAt = shouldLookAt
    }

    public shouldLookAt(): boolean {
        return this._lookAt
    }

    public getName(): string {
        return this._name;
    }

}

export default CanvasCamera