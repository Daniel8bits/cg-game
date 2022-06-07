import InputManager, { Keys } from "@razor/core/InputManager";
import ResourceManager from "@razor/core/ResourceManager";
import Hitbox from "@razor/physics/hitboxes/HitBox";
import Renderer from "../../engine/renderer/Renderer";
import HallDoorEntity from "./HallDoorEntity";
import MapEntity from "./MapEntity";
import Player from "./Player";

class DoorPanelEntity extends MapEntity {

  private _hallDoor: HallDoorEntity
  private _player: Player

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
  }
  
  public update(time: number, delta: number): void {

    const position = this.getTransform().getTranslation()
    const playerPosition = this._player.getTransform().getTranslation()
      
    if(position.distanceTo(playerPosition) < 5 && InputManager.isKeyPressed(Keys.KEY_F)) {
      this._hallDoor.interact()
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

}

export default DoorPanelEntity