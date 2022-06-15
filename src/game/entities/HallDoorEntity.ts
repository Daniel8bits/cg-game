import Hitbox from "@razor/physics/hitboxes/HitBox";
import Renderer from "@razor/renderer/Renderer";
import MapEntity from "./MapEntity";
import ResourceManager from "@razor/core/ResourceManager";
import { Matrix4, Vector3 } from "@math.gl/core";
import Sound from "../Sound";
import DialogEntity from "./gui/DialogEntity";
import Player from "./player/Player";
import Camera from "@razor/core/Camera";
import Transform from "@razor/math/Transform";
import GameController from "../GameController";

export enum HallDoorState {
  OPENED = 0,
  OPENING = 1,
  CLOSED = 2,
  CLOSING = 3
}

class HallDoorEntity extends MapEntity {

  private _state: HallDoorState
  private _counter: number
  private _camera: Camera;
  private _cameraTransform: Transform;
  private _giveAmmunition : boolean;
  public constructor(
    name: string,
    hitbox: Hitbox,
    renderer: Renderer,
    cameraTransform: Transform = new Transform
  ) {
    super(
      name,
      hitbox,
      1,
      ResourceManager.getVAO('hall-door'),
      ResourceManager.getMaterial('hall-door'),
      renderer
    );
    this._state = HallDoorState.CLOSED
    this._counter = 0
    this._camera = Camera.Main;
    this._cameraTransform = cameraTransform;
    this._giveAmmunition = false;
  }

  public update(time: number, delta: number): void {



    if (this._state === HallDoorState.OPENING) {
      const position = this.getTransform().getTranslation()
      this._counter += 0.01
      this.getTransform().setTranslation(
        new Vector3()
          .lerp(
            [position.x, 0.01, position.z],
            [position.x, -6.75, position.z],
            this._counter
          )
      )
      if (this._counter > 1) {
        this.isOpen(true);
        this._state = HallDoorState.OPENED
        this.getHitbox().disableCollision(true)
        this._counter = 0
      }
    }
    else if (this._state === HallDoorState.CLOSING) {
      const position = this.getTransform().getTranslation()
      this._counter += 0.01
      this.getTransform().setTranslation(
        new Vector3()
          .lerp(
            [position.x, -6.75, position.z],
            [position.x, 0.01, position.z],
            this._counter
          )
      )
      if (this._counter > 1) {
        this.isClose(true);

        this._state = HallDoorState.CLOSED
        this.getHitbox().disableCollision(false)
        this._counter = 0
      }
    }

  }

  public interact(): void {
    if (this._state === HallDoorState.CLOSED) {
      this.isOpen(false);;
      this._state = HallDoorState.OPENING
    }
    else if (this._state === HallDoorState.OPENED) {
      this.isClose(false);
      this._state = HallDoorState.CLOSING
    }
  }

  private isOpen(finish: boolean) {
    if (finish) {
      if(!this._giveAmmunition){
        this._giveAmmunition = true;
        GameController.update("ammunition", 10);
        DialogEntity.getDialog("display").animateText("municao coletada", 30, { vertical: '10%', horizontal: 'center' }, function () {
          setTimeout(() => this.remove(), 2000);
        });
      }
      Sound.Find("door").pause();
      setTimeout(() => Player.getInstance().setStop(false),300);
    } else {
      DialogEntity.getDialog("display").animateText("portao aberto", 30, { vertical: '10%', horizontal: 'center' }, function () {
        setTimeout(() => this.remove(), 2000);
      });
      Sound.Find("door").play();
      Player.getInstance().setStop(true);
      this._camera.getTransform().setTranslation(this._cameraTransform.getTranslation());
      this._camera.getTransform().setRotation(this._cameraTransform.getRotation());
    }
  }

  private isClose(finish: boolean) {
    if (finish) {
      Sound.Find("door").pause();
      setTimeout(() => Player.getInstance().setStop(false),300);
    } else {

      DialogEntity.getDialog("display").animateText("portao fechado", 30, { vertical: '10%', horizontal: 'center' }, function () {
        setTimeout(() => this.remove(), 2000);
      });
      Sound.Find("door").play();
      Player.getInstance().setStop(true);
      this._camera.getTransform().setTranslation(this._cameraTransform.getTranslation());
      this._camera.getTransform().setRotation(this._cameraTransform.getRotation());
    }
  }

  public getState(): HallDoorState {
    return this._state
  }

}

export default HallDoorEntity