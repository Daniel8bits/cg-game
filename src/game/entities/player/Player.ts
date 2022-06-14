import { Matrix4, toRadians, Vector2, Vector3 } from '@math.gl/core';
import Vector from '@math.gl/core/src/classes/base/vector';
import Camera from '@razor/core/Camera';
import DynamicEntity from '@razor/core/entities/DynamicEntity';
import InputManager, { Keys } from '@razor/core/InputManager';
import Razor from '@razor/core/Razor';
import ResourceManager from '@razor/core/ResourceManager';
import { gl } from '@razor/gl/GLUtils';
import Orientation from '@razor/math/Orientation';
import Transform from '@razor/math/Transform';
import Hitbox from '@razor/physics/hitboxes/HitBox';
import GameController from 'src/game/GameController';
import Sound from 'src/game/Sound';
import Material from "../../../engine/appearance/material/Material";
import VAO from "../../../engine/buffer/VAO";
import Renderer from "../../../engine/renderer/Renderer";
import { IEntityWithLight } from '../IEntityWithLight';
import Lamp from '../Lamp';
import Gun, { GunState } from './Gun';

class Player extends DynamicEntity implements IEntityWithLight {

  private _camera: Camera;
  private _sensitivity: number
  private _impulse: number

  private _handTransform: Transform
  private _gun: Gun

  private _lampList: Lamp[]
  private static _instance: Player; 
  private _stop : boolean;


  public constructor(
    name: string, 
    hitbox: Hitbox,
    camera: Camera,
    renderer: Renderer
  ) {
    super(
      name, 
      hitbox, 
      1, 
      ResourceManager.getVAO('hand'), 
      ResourceManager.getMaterial('hand'), 
      renderer
    );
    this._camera = camera;
    this._sensitivity = 7.5
    this._impulse = 100
    this._handTransform = new Transform(
      new Vector3(-0.8, 1, 1.5),
      new Orientation(0, 180, 20),
      new Vector3(1, 1, 1),
    )
    this._handTransform.parent = this.getTransform()
    this._lampList = []
    this._gun = null
    this._stop = false;
    Player._instance = this;
  }

  public update(time: number, delta: number): void {
    if(this._stop) return;
    this._updateCameraPosition()

    this._move(delta)

  }


  private _move(delta: number): void {

    this.getForce().x = 0
    this.getForce().y = 0
    this.getForce().z = 0

    const x = Math.sin(toRadians(this.getTransform().getRotation().y)) * this._impulse * delta;
    const z = Math.cos(toRadians(this.getTransform().getRotation().y)) * this._impulse * delta;

    let isStep = false;

    if(InputManager.isKeyPressed(Keys.KEY_W)){ // FRONT
      isStep = true;
      Sound.Find("step").play(true);
      this.getForce().add(new Vector3(x, 0, z))
    }

    if(InputManager.isKeyPressed(Keys.KEY_S)){ // BACK
      isStep = true;
      Sound.Find("step").play(true);
      this.getForce().add(new Vector3(-x, 0, -z))
    }

    if(InputManager.isKeyPressed(Keys.KEY_A)){ // LEFT
      isStep = true;
      Sound.Find("step").play(true);
      this.getForce().add(new Vector3(z, 0, -x))
    }

    if(InputManager.isKeyPressed(Keys.KEY_D)){ // RIGHT
      isStep = true;
      Sound.Find("step").play(true);
      this.getForce().add(new Vector3(-z, 0, x))
    }

    if(!isStep) Sound.Find("step").pause();
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


    if(InputManager.isKeyPressed(Keys.KEY_E) && this._gun.getState() === GunState.CHARGED){ // RIGHT
      GameController.update("ammunition",-1);
      Sound.Find("gun").play();
      const position = this.getTransform().getTranslation()
      const ray = new Vector3(0, 0, 20).transform(
        this.getTransform().toInversePositionMatrix()
      )
      this._gun.shoot(
        new Vector2(
          position.x,
          position.z
        ),
        new Vector2(
          ray.x,
          ray.z
        )
      )
    }

    if(InputManager.isKeyPressed(Keys.KEY_LEFT)){ // RIGHT
      const rotation = this.getTransform().getRotation()
      this.getTransform().setYaw(rotation.yaw + this._impulse*2 * delta)
    }

    if(InputManager.isKeyPressed(Keys.KEY_RIGHT)){ // RIGHT
      const rotation = this.getTransform().getRotation()
      this.getTransform().setYaw(rotation.yaw + -this._impulse*2 * delta)
    }

    if(InputManager.isKeyPressed(Keys.KEY_ESCAPE)){// ESC
      Razor.IS_MOUSE_INSIDE = false;
    }

    if(Razor.IS_MOUSE_INSIDE) {
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

  public setLampList(lampList: Lamp[]): void {
    this._lampList = lampList
  }

  public getLampList(): Lamp[] {
    return this._lampList
  }

  public getHandTransformMatrix(): Matrix4 {
    return this.getTransform().toMatrix().multiplyRight(this._handTransform.toMatrix())
    //return this._handTransform.toMatrix().multiplyRight(this.getTransform().toMatrix())
    //return this._handTransform.worldMatrix()
    //return this._handTransform.toMatrix()
    /*
    return this._handTransform.worldMatrixFrom(
      new Transform(
        this.getTransform().getTranslation().add(this._handTransform.getTranslation()),
        this.getTransform().getRotation().add(this._handTransform.getRotation()),
        this._handTransform.getScale()
      )
    )
    */
  }

  public getHandTransform(): Transform {
    return this._handTransform
  }

  public setGun(gun: Gun) {
    this._gun = gun
  }

  public getGun(): Gun {
    return this._gun
  }

  
  public static getInstance(){
    return Player._instance;
  }


  public setStop(value : boolean){
    this._stop = value; 
  }
  public getStop() : boolean{
    return this._stop; 
  }

}

export default Player