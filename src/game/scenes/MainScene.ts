import PhysicsScene from "@razor/core/scenes/PhysicsScene";
import RenderStrategy from "@razor/renderer/RenderStrategy";
import EntityFactory from "../entities/EntityFactory";
import DoorPanelEntity from "../entities/DoorPanelEntity";
import HallDoorEntity from "../entities/HallDoorEntity";
import Player from "../entities/Player";
import CircleHitbox from "@razor/physics/hitboxes/CircleHitbox";
import { Vector3 } from "@math.gl/core";
import Orientation from "@razor/math/Orientation";
import Camera from "@razor/core/Camera";

class MainScene extends PhysicsScene {

  private _renderStrategy: RenderStrategy
  private _camera: Camera

  public constructor(renderStrategy: RenderStrategy, camera: Camera) {
    super('main')
    this._renderStrategy = renderStrategy
    this._camera = camera
    this._init()
  }

  private _init() {
    
    const player = new Player('player', new CircleHitbox(2), this._camera)

    player.getTransform().setTranslation(new Vector3(51.1, 0, -88))
    player.getTransform().setRotation(new Orientation(0, -32))

    this.add(player)

    new EntityFactory(
      this,
      this._renderStrategy
    ).load()

    const doorPanelMapping = {
      "door-panel_3": "hall-door_0",
      "door-panel_4": "hall-door_2",
      "door-panel_0": "hall-door_1",
      "door-panel_5": "hall-door_4",
      "door-panel_6": "hall-door_6",
      "door-panel_1": "hall-door_7",
      "door-panel_7": "hall-door_8",
      "door-panel_8": "hall-door_10",
      "door-panel_2": "hall-door_11"
    }

    this.filterVisible(entity => entity instanceof HallDoorEntity)
      .forEach(entity => (entity as HallDoorEntity).getHitbox().disableCollision(true))

    this.filterVisible(entity => entity instanceof DoorPanelEntity)
      .forEach(entity => {
        const hallDoor = this.get(doorPanelMapping[entity.getName()]) as HallDoorEntity;
        hallDoor.getHitbox().disableCollision(false);
        (entity as DoorPanelEntity).setHallDoor(hallDoor);
        (entity as DoorPanelEntity).setPlayer(player)
      })

  }

  public update(time: number, delta: number) {
    super.update(time, delta)
  }

}

export default MainScene