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

  public constructor(
    name: string, 
    hitbox: Hitbox,
    camera: Camera
  ) {
    super(name, hitbox, 1, null, null, null);
    this._camera = camera;
    this._sensitivity = 7.5
    this._impulse = 100
  }


  public update(time: number, delta: number): void {

    this._updateCameraPosition()

    this._move(delta)

  }


  private _move(delta: number): void {

    this.getForce().x = 0
    this.getForce().y = 0
    this.getForce().z = 0

    const x = Math.sin(toRadians(this.getTransform().getRotation().y)) * this._impulse * delta;
    const z = Math.cos(toRadians(this.getTransform().getRotation().y)) * this._impulse * delta;

    if(InputManager.isKeyPressed(Keys.KEY_W)){ // FRONT
      this.getForce().add(new Vector3(x, 0, z))
    }

    if(InputManager.isKeyPressed(Keys.KEY_S)){ // BACK
      this.getForce().add(new Vector3(-x, 0, -z))
    }

    if(InputManager.isKeyPressed(Keys.KEY_A)){ // LEFT
      this.getForce().add(new Vector3(z, 0, -x))
    }

    if(InputManager.isKeyPressed(Keys.KEY_D)){ // RIGHT
      this.getForce().add(new Vector3(-z, 0, x))
    }
/*
    if(InputManager.isKeyPressed(Keys.KEY_SPACE) && this.getTransform().getY() > -1 && this.getSpeed().y > -1){ // UP
      this.getForce().add(new Vector3(0, -this._impulse*10 * delta, 0))
    }

    if(InputManager.isKeyPressed(Keys.KEY_C)){ // DOWN
        this.getForce().add(new Vector3(0, this._impulse*3 * delta, 0))
    }
*/

    if(InputManager.isKeyPressed(Keys.KEY_K)){ // RIGHT
      this.getTransform().setPitch(0)
    }

    if(InputManager.isKeyPressed(Keys.KEY_LEFT)){ // RIGHT
      const rotation = this.getTransform().getRotation()
      this.getTransform().setYaw(rotation.yaw + this._impulse*2 * delta)
    }

    if(InputManager.isKeyPressed(Keys.KEY_RIGHT)){ // RIGHT
      const rotation = this.getTransform().getRotation()
      this.getTransform().setYaw(rotation.yaw + -this._impulse*2 * delta)
    }

    

    if(InputManager.isMouseLeft()) {
        const dx = InputManager.getMouseDX() 
        const dy = InputManager.getMouseDY() 

        const rotation = this.getTransform().getRotation()
        this.getTransform().setPitch(rotation.pitch + dy * this._sensitivity * delta)
        this.getTransform().setYaw(rotation.yaw + dx * this._sensitivity * delta)
    }
    

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