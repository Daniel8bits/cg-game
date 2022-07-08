import Hitbox from "@razor/physics/hitboxes/HitBox";
import Renderer from "@razor/renderer/Renderer";
import MapEntity from "./MapEntity";
import ResourceManager from "@razor/core/ResourceManager";
import { Vector3 } from "@math.gl/core";
import DialogEntity from "./gui/common/DialogEntity";
import Player from "./player/Player";
import Camera from "@razor/core/Camera";
import Transform from "@razor/math/Transform";
import Scene from "@razor/core/scenes/Scene";
import Updater from "@razor/core/updater/Updater";
import HUD from "./gui/hud/HUD";

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

  public update(time: number, delta: number, currentScene : Scene, updater: Updater): void {

    if (this._state === HallDoorState.OPENING) {
      const position = this.getTransform().getTranslation()
      if(this._counter === 0) {
        this._openingVFX(false, updater)
      }
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
        this._openingVFX(true, updater);
        this._state = HallDoorState.OPENED
        this.getHitbox().disableCollision(true)
        this._counter = 0
      }
    }
    else if (this._state === HallDoorState.CLOSING) {
      const position = this.getTransform().getTranslation()
      if(this._counter === 0) {
        this._closingVFX(false)
      }
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
        this._closingVFX(true);

        this._state = HallDoorState.CLOSED
        this.getHitbox().disableCollision(false)
        this._counter = 0
      }
    }

  }

  public interact(): void {
    if (this._state === HallDoorState.CLOSED) {
      this._state = HallDoorState.OPENING
    }
    else if (this._state === HallDoorState.OPENED) {
      this._state = HallDoorState.CLOSING
    }
  }

  private _openingVFX(finish: boolean, updater: Updater) {
    if (finish) {

      ResourceManager.getSound("door").pause()
      setTimeout(() => Player.getInstance().setStop(false),300);

    } else {
      DialogEntity.getDialog("display").animateText("door was opened", 30, { vertical: '10%', horizontal: 'center' }, (dialog) => {
        setTimeout(() => { 
          dialog.remove()
          this._giveAmmo(updater)
        }, 1000);
      });
      ResourceManager.getSound("door").play()
      Player.getInstance().setStop(true);
      this._camera.getTransform().setTranslation(this._cameraTransform.getTranslation());
      this._camera.getTransform().setRotation(this._cameraTransform.getRotation());

    }
  }

  private _giveAmmo(updater: Updater): void {
    if(!this._giveAmmunition) {
      this._giveAmmunition = true;
      const hud = updater.get(HUD.NAME) as HUD
      hud.setAmmo(hud.getAmmo() + 20)
      DialogEntity.getDialog("display").animateText("ammo collected", 30, { vertical: '10%', horizontal: 'center' }, (dialog) => {
        setTimeout(() => dialog.remove(), 500);
      });
    }
  }

  private _closingVFX(finish: boolean) {
    if (finish) {

      ResourceManager.getSound("door").pause()
      setTimeout(() => Player.getInstance().setStop(false),300);

    } else {

      DialogEntity.getDialog("display").animateText("door was closed", 30, { vertical: '10%', horizontal: 'center' }, (dialog) => {
        setTimeout(() => dialog.remove(), 1000);
      });
      ResourceManager.getSound("door").play()
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