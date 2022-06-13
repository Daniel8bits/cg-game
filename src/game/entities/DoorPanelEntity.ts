import InputManager, { Keys } from "@razor/core/InputManager";
import ResourceManager from "@razor/core/ResourceManager";
import Hitbox from "@razor/physics/hitboxes/HitBox";
import Renderer from "../../engine/renderer/Renderer";
import DoorPanelMaterial from "../materials/DoorPanelMaterial";
import Sound from "../Sound";
import DialogEntity from "./gui/DialogEntity";
import HallDoorEntity, { HallDoorState } from "./HallDoorEntity";
import MapEntity from "./MapEntity";
import Player from "./player/Player";

class DoorPanelEntity extends MapEntity {

  private _hallDoor: HallDoorEntity
  private _player: Player

  private _locked: boolean

  public constructor(
      name: string, 
      hitbox: Hitbox,
      renderer: Renderer
  ) {
    super(
        name, 
        hitbox, 
        1, 
        ResourceManager.getVAO('door-panel'), 
        ResourceManager.getMaterial('door-panel'), 
        renderer
    );
    this._hallDoor = null
    this._player = null
    this._locked = true
  }
  
  public update(time: number, delta: number): void {

    const position = this.getTransform().getTranslation()
    const playerPosition = this._player.getTransform().getTranslation()
      
    if(position.distanceTo(playerPosition) < 5 && InputManager.isKeyPressed(Keys.KEY_F)) {
      this._hallDoor.interact()

      if(this._hallDoor.getState() === HallDoorState.CLOSING) {
        this.setLocked(true);
      } else if(this._hallDoor.getState() === HallDoorState.OPENING) {
        this.setLocked(false);
      }
    }

  }



  public setHallDoor(hallDoor: HallDoorEntity): void {
    this._hallDoor = hallDoor
  }

  public getHallDoor(): HallDoorEntity {
    return this._hallDoor
  }

  public setPlayer(player: Player): void {
    this._player = player
  }

  public getPlayer(): Player {
    return this._player
  }

  public setLocked(locked: boolean): void {
    this._locked = locked
    /*
    Sound.Find("door").play();
    DialogEntity.getDialog("display").animateText(locked ? "portao fechado" : "portao aberto",30,{vertical:'10%',horizontal:'center'},function(){
      setTimeout(() => this.remove(),2000);
    });*/
  }

  public isLocked(): boolean {
    return this._locked
  }

}

export default DoorPanelEntity