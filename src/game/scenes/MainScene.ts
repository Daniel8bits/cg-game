import PhysicsScene from "@razor/core/scenes/PhysicsScene";
import RenderStrategy from "@razor/renderer/RenderStrategy";
import EntityFactory from "../entities/EntityFactory";
import DoorPanelEntity from "../entities/DoorPanelEntity";
import HallDoorEntity from "../entities/HallDoorEntity";
import Player from "../entities/player/Player";
import CircleHitbox from "@razor/physics/hitboxes/CircleHitbox";
import { Vector3 } from "@math.gl/core";
import Orientation from "@razor/math/Orientation";
import Camera from "@razor/core/Camera";
import Lamp from "../entities/Lamp";
import Entity from "@razor/core/entities/Entity";
import Gun from "../entities/player/Gun";
import Monster from "../entities/monster/Monster";
import MonsterRenderer from "../renderers/MonsterRenderer";

class MainScene extends PhysicsScene {

  private _camera: Camera
  private _entityFactory: EntityFactory
  private _player: Player
  private _gun: Gun
  private _lamps: Lamp[]

  public constructor(camera: Camera) {
    super('main')
    this._camera = camera
    this._entityFactory = new EntityFactory(this, this.getRenderStrategy())
    this._player = new Player(
      'player', 
      new CircleHitbox(2), 
      this._camera,
      this.getRenderStrategy().get('player-renderer')
    )
    this._gun = new Gun(this.getRenderStrategy().get('player-renderer'), this)
    this._lamps = []
    this._init()
  }

  private _init() {

    this._player.getTransform().setTranslation(new Vector3(51.1, 0, -88))
    this._player.getTransform().setRotation(new Orientation(0, -32))
    this._player.setGun(this._gun)

    this._gun.getTransform().parent = this._player.getHandTransform()

    this.add(this._player)
    this.add(this._gun)

    this._entityFactory.load()

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
        (entity as DoorPanelEntity).setPlayer(this._player)
      })

    this.forEach((entity: Entity) => {
      if(entity instanceof Lamp) {
        this._lamps.push(entity)
      }
    })

    const monsterRenderer = this.getRenderStrategy().get('monster-renderer') as MonsterRenderer;
    monsterRenderer.setPlayer(this._player)

    const monster = new Monster('m1', monsterRenderer)
    monster.getTransform().setTranslation(new Vector3(36, 0, -65));
    monster.getTransform().setRotation(new Orientation(0, -30, 0));
    monster.getTransform().setScale(new Vector3(1, 2, 1));

    monster.setLampList(this._entityFactory.get5ClosestLamps(monster, this._lamps))

    this.add(monster)

    const monster2 = new Monster('m2', monsterRenderer)
    monster2.getTransform().setTranslation(new Vector3(25, 0, -47));
    monster2.getTransform().setRotation(new Orientation(0, -30, 0));
    monster2.getTransform().setScale(new Vector3(1, 2, 1));

    monster2.setLampList(this._entityFactory.get5ClosestLamps(monster2, this._lamps))

    this.add(monster2)

  }

  public update(time: number, delta: number) {
    super.update(time, delta);

    this._player.setLampList(this._entityFactory.get5ClosestLamps(this._player, this._lamps))
    this._gun.setLampList(this._entityFactory.get5ClosestLamps(this._gun, this._lamps, this._gun.getTransform().worldTranslation()))

  }

  public render(): void {
    super.render()
  }

}

export default MainScene