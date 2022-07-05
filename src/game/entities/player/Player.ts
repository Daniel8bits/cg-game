import { Matrix4, toRadians, Vector2, Vector3 } from '@math.gl/core';
import Camera from '@razor/core/Camera';
import DynamicEntity from '@razor/core/entities/DynamicEntity';
import InputManager, { Keys } from '@razor/core/InputManager';
import Razor from '@razor/core/Razor';
import ResourceManager from '@razor/core/ResourceManager';
import Scene from '@razor/core/scenes/Scene';
import Updater from '@razor/core/updater/Updater';
import Orientation from '@razor/math/Orientation';
import Transform from '@razor/math/Transform';
import Hitbox from '@razor/physics/hitboxes/HitBox';
import EndScene from 'src/game/scenes/EndScene';
import MainScene from 'src/game/scenes/MainScene';
import Renderer from "../../../engine/renderer/Renderer";
import HUD from '../gui/hud/HUD';
import { IEntityWithLight } from '../IEntityWithLight';
import Lamp from '../Lamp';
import Gun, { GunState } from './Gun';

class Player extends DynamicEntity implements IEntityWithLight {

  private readonly WALKING_DISTANCE: number = 300
  private readonly WALKING_HEIGHT: number = 8

  private _camera: Camera;
  private _sensitivity: number
  private _impulse: number
  private _walking: number

  private _handTransform: Transform
  private _gun: Gun

  private _lampList: Lamp[]
  private static _instance: Player;
  private _stop: boolean;
  private _end: Transform;


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
    this._impulse = 75
    this._walking = 0
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

  public update(time: number, delta: number, currentScene: Scene, updater: Updater): void {
    if (this._stop) return;
    this._updateCameraPosition()

    this._walkingMovement(delta)
    this._move(delta, currentScene, updater)

    if(this._end.getTranslation().distanceTo(this.getTransform().getTranslation()) < 10){
      //GameTest.getInstance().setScene(EndScene.END_SCENE);
      (currentScene as MainScene).gameOver(EndScene.END_SCENE)
    }

  }

  public setEndPoint(transform : Transform){
    this._end = transform;
  }

  private _move(delta: number, currentScene: Scene, updater: Updater): void {

    this.getForce().x = 0
    this.getForce().y = 0
    this.getForce().z = 0

    const x = Math.sin(toRadians(this.getTransform().getRotation().y)) * this._impulse * delta;
    const z = Math.cos(toRadians(this.getTransform().getRotation().y)) * this._impulse * delta;

    let isStep = false;

    if (InputManager.isKeyPressed(Keys.KEY_W)) { // FRONT
      isStep = true;
      ResourceManager.getSound("step").play(true);
      this.getForce().add(new Vector3(x, 0, z))
    }

    if (InputManager.isKeyPressed(Keys.KEY_S)) { // BACK
      isStep = true;
      ResourceManager.getSound("step").play(true);
      this.getForce().add(new Vector3(-x, 0, -z))
    }

    if (InputManager.isKeyPressed(Keys.KEY_A)) { // LEFT
      isStep = true;
      ResourceManager.getSound("step").play(true);
      this.getForce().add(new Vector3(z, 0, -x))
    }

    if (InputManager.isKeyPressed(Keys.KEY_D)) { // RIGHT
      isStep = true;
      ResourceManager.getSound("step").play(true);
      this.getForce().add(new Vector3(-z, 0, x))
    }

    if (!isStep) ResourceManager.getSound("step").pause();

    if (InputManager.isKeyPressed(Keys.KEY_K)) { // RIGHT
      this.getTransform().setPitch(0)
    }


    if (InputManager.isKeyPressed(Keys.KEY_E) && this._gun.getState() === GunState.CHARGED) { // RIGHT
      const hud = (updater.get("hud") as HUD)
      if (hud.getAmmo() > 0) {
        //GameController.update("ammunition", -1);
        hud.decrementAmmo()
        setTimeout(() => ResourceManager.getSound("gun").play(false, true), 100);
        const position = this.getTransform().getTranslation()
        const ray = new Vector3(0, 0, 20).transform(
          this.getTransform().toInversePositionMatrix()
        );
        this._gun.shoot(
          new Vector2(
            position.x,
            position.z
          ),
          new Vector2(
            ray.x,
            ray.z
          ),
          currentScene
        )
      } else {
        ResourceManager.getSound("empty_gun").play()
      }
    }

    if (InputManager.isKeyPressed(Keys.KEY_LEFT)) { // RIGHT
      const rotation = this.getTransform().getRotation()
      this.getTransform().setYaw(rotation.yaw + this._impulse * 2 * delta)
    }

    if (InputManager.isKeyPressed(Keys.KEY_RIGHT)) { // RIGHT
      const rotation = this.getTransform().getRotation()
      this.getTransform().setYaw(rotation.yaw + -this._impulse * 2 * delta)
    }

    if (InputManager.isKeyPressed(Keys.KEY_ESCAPE)) {// ESC
      Razor.IS_MOUSE_INSIDE = false;
    }

    if (Razor.IS_MOUSE_INSIDE) {
      const dx = InputManager.getMouseDX()

      const rotation = this.getTransform().getRotation()
      this.getTransform().setYaw(rotation.yaw + dx * this._sensitivity * delta)
    }

  }

  private _walkingMovement(delta: number): void {
    if (!this.getForce().exactEquals([0, 0, 0])) {
      this._walking += delta * this.WALKING_DISTANCE
      if(this._walking >= 180) {
        this._walking -= 180
      }
      this.getTransform().getLocalTransform()
        .translation.y = -Math.abs(Math.sin(toRadians(this._walking))) / this.WALKING_HEIGHT
    } else if (this._walking > 0 && this._walking <= 90) {
      this._walking -= delta * this.WALKING_DISTANCE
      if(this._walking < 0) {
        this._walking = 0
      }
      this.getTransform().getLocalTransform()
        .translation.y = -Math.abs(toRadians(this._walking)) / this.WALKING_HEIGHT
    } else if (this._walking > 90 && this._walking < 180) {
      this._walking += delta * this.WALKING_DISTANCE
      if(this._walking >= 180) {
        this._walking = 0
      }
      this.getTransform().getLocalTransform()
        .translation.y = -Math.abs(Math.sin(toRadians(this._walking))) / this.WALKING_HEIGHT
    }
  }

  private _updateCameraPosition(): void {
    const localTransform = this._camera.getTransform().getLocalTransform()
    localTransform.translation.y = this.getTransform().getLocalTransform().translation.y
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


  public static getInstance() {
    return Player._instance;
  }


  public setStop(value: boolean) {
    this._stop = value;
  }
  public getStop(): boolean {
    return this._stop;
  }

}

export default Player