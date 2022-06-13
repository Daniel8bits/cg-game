import Hitbox from "@razor/physics/hitboxes/HitBox";
import Renderer from "@razor/renderer/Renderer";
import MapEntity from "./MapEntity";
import ResourceManager from "@razor/core/ResourceManager";
import { Vector3 } from "@math.gl/core";
import Sound from "../Sound";
import DialogEntity from "./gui/DialogEntity";

export enum HallDoorState {
  OPENED = 0,
  OPENING = 1,
  CLOSED = 2,
  CLOSING = 3
}

class HallDoorEntity extends MapEntity {

  private _state: HallDoorState
  private _counter: number

  public constructor(
      name: string, 
      hitbox: Hitbox,
      renderer: Renderer
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
  }
  
  public update(time: number, delta: number): void {
    
    
    
    if(this._state === HallDoorState.OPENING) {
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
      if(this._counter > 1) {
        Sound.Find("door").pause();
        this._state = HallDoorState.OPENED
        this.getHitbox().disableCollision(true)
        this._counter = 0
      }
    }
    else if(this._state === HallDoorState.CLOSING) {
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
      if(this._counter > 1) {
        Sound.Find("door").pause();
        this._state = HallDoorState.CLOSED
        this.getHitbox().disableCollision(false)
        this._counter = 0
      }
    }

  }

  public interact(): void {
    if(this._state === HallDoorState.CLOSED) {
      DialogEntity.getDialog("display").animateText("portao aberto",30,{vertical:'10%',horizontal:'center'},function(){
        setTimeout(() => this.remove(),2000);
      });
      Sound.Find("door").play();
      this._state = HallDoorState.OPENING
    }
    else if(this._state === HallDoorState.OPENED) {
      DialogEntity.getDialog("display").animateText("portao fechado",30,{vertical:'10%',horizontal:'center'},function(){
        setTimeout(() => this.remove(),2000);
      });
      Sound.Find("door").play();
      this._state = HallDoorState.CLOSING
    }
  }

  public getState(): HallDoorState {
    return this._state
  }

}

export default HallDoorEntity