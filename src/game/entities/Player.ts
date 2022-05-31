import { toRadians, Vector3 } from '@math.gl/core';
import Camera from '@razor/core/Camera';
import DynamicEntity from '@razor/core/entities/DynamicEntity';
import InputManager, { Keys } from '@razor/core/InputManager';
import Hitbox from '@razor/physics/hitboxes/HitBox';
import Material from "../../engine/appearance/material/Material";
import VAO from "../../engine/buffer/VAO";
import Renderer from "../../engine/renderer/Renderer";

class Player extends DynamicEntity {

  private _camera: Camera;
  private _sensitivity: number
  private _impulse: number

  private _accelerating: boolean
  private _decay: number

  public constructor(
    name: string, 
    hitbox: Hitbox,
    camera: Camera
  ) {
    super(name, hitbox, 1, null, null, null);
    this._camera = camera;
    this._sensitivity = 7.5
    this._impulse = 10
    this._accelerating = false;
    this._decay = 0
  }


  public update(time: number, delta: number): void {

    this._updateCameraPosition()

    this._move(delta)

  }


  private _move(delta: number): void {

    this._accelerating = false
    this.getForce().x = 0
    this.getForce().y = 0
    this.getForce().z = 0

    const siny = Math.sin(toRadians(this.getTransform().getRotation().y))
    const cosy = Math.cos(toRadians(this.getTransform().getRotation().y))
    const x = siny * this._impulse * delta;
    const z = cosy * this._impulse * delta;

    if(InputManager.isKeyPressed(Keys.KEY_W)){ // FRONT
      this.getForce().add(new Vector3(x, 0, z))
      this._accelerating = true
    }

    if(InputManager.isKeyPressed(Keys.KEY_S)){ // BACK
      this.getForce().add(new Vector3(-x, 0, -z))
      this._accelerating = true
    }

    if(InputManager.isKeyPressed(Keys.KEY_A)){ // LEFT
      this.getForce().add(new Vector3(z, 0, -x))
      this._accelerating = true
    }

    if(InputManager.isKeyPressed(Keys.KEY_D)){ // RIGHT
      this.getForce().add(new Vector3(-z, 0, x))
      this._accelerating = true
    }

    if(InputManager.isKeyPressed(Keys.KEY_SPACE) && this.getTransform().getY() === 0 && this.getSpeed().y === 0){ // UP
      this.getForce().add(new Vector3(0, -this._impulse*10 * delta, 0))
      this._accelerating = true
    }

    if(InputManager.isKeyPressed(Keys.KEY_C)){ // DOWN
        this.getForce().add(new Vector3(0, this._impulse*3 * delta, 0))
        this._accelerating = true
    }

    if(InputManager.isMouseLeft()) {
        const dx = InputManager.getMouseDX() 
        const dy = InputManager.getMouseDY() 

        const rotation = this.getTransform().getRotation()
        this.getTransform().setPitch(rotation.pitch + dy * this._sensitivity * delta)
        this.getTransform().setYaw(rotation.yaw + dx * this._sensitivity * delta)

    }
/*
    if(this._accelerating) {
      this._decay = 0
    }
    else if(!this._accelerating && !this.getSpeed().exactEquals([0, 0, 0])) {
      this.setSpeed(new Vector3().lerp(this.getSpeed(), new Vector3(0, 0, 0), this._decay/100))
      this._decay++
    }
*/
    //this._clampSpeed(siny, cosy)
    

  }

  private _clampSpeed(siny: number, cosy: number): void {
    
    const MAX_SPEED = 1

    if(new Vector3(this.getSpeed()).add(this.getForce()).magnitude() >  MAX_SPEED) {
      this.getForce().x = 0
      this.getForce().y = 0
      this.getForce().z = 0
    }/*
    if(this.getSpeed().y > MAX_SPEED) {
      this.getForce().y = 0
    }
    if(this.getSpeed().z >  MAX_SPEED) {
      this.getForce().z = 0
    }*/
  }

  private _updateCameraPosition(): void {
    this._camera.getTransform().setTranslation(
      this.getTransform().getTranslation()
    )
    this._camera.getTransform().setRotation(
      this.getTransform().getRotation()
    )
  }




}

export default Player