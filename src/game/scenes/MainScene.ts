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
import PathFinding from "../pathfinding/PathFinding";
import BloomRenderer from "../renderers/BloomRenderer";
import DialogEntity from "../entities/gui/common/DialogEntity";
import Updater from "@razor/core/updater/Updater";
import HUD from "../entities/gui/hud/HUD";
import GuiRenderer from "../renderers/GuiRenderer";
import FadingRenderer from "../renderers/FadingRenderer";
import GameTest from "../GameTest";

class MainScene extends PhysicsScene {

  public static readonly NAME: string = "main"

  private _camera: Camera
  private _entityFactory: EntityFactory
  private _player: Player
  private _gun: Gun
  private _lamps: Lamp[]
  private _pathFinding: PathFinding
  private _lampSortingTimer: number
  private _pathFindingCalculationTimer: number
  private _hud: HUD
  
  private _frameBuffer: BloomRenderer[] = [];
  private _fading: FadingRenderer

  public constructor(camera: Camera, fadingRenderer: FadingRenderer) {
    super(MainScene.NAME)
    this._camera = camera
    this._entityFactory = new EntityFactory(this, this.getRenderStrategy())
    this._player = null
    this._gun = null
    this._lamps = []
    this._pathFinding = null
    this._lampSortingTimer = 3
    this._pathFindingCalculationTimer = 5
    this._fading = fadingRenderer
  }

  public init(updater: Updater) {

    this._hud = new HUD(this)
    updater.add(this._hud)

    this._frameBuffer.push(new BloomRenderer(this._camera,'albedo', 1));
    this._frameBuffer.push(new BloomRenderer(this._camera,'mascara', 0.25));

    this._player = new Player(
      'player', 
      new CircleHitbox(2), 
      this._camera,
      this.getRenderStrategy().get('player-renderer')
    )
    this._gun = new Gun(this.getRenderStrategy().get('player-renderer'))

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

    this._pathFinding = new PathFinding(this, this._player)
        
    this._pathFinding.loadNodes()

    this.onChange(() => {
      this._fading.fadeIn()
      this._camera.getTransform().setTranslation(new Vector3(51.1, 0, -88))
      this._camera.getTransform().setRotation( new Orientation(0, -32));
      DialogEntity.Find("display").animateText("chegue ate o elevador", 20, { vertical: '10%', horizontal: 'center' }, (dialog) => {
        setTimeout(() => dialog.remove(), 5000);
      });
    })

  }

  public gameOver(scene: string): void {
    this._fading.fadeOut()
    setTimeout(() => {
      GameTest.getInstance().setScene(scene)
    }, 1000);
  }

  public update(time: number, delta: number, updater: Updater) {
    super.update(time, delta, updater);

    if(this._lampSortingTimer > 3) {
      this._player.setLampList(this._entityFactory.get5ClosestLamps(this._player, this._lamps))
      this._gun.setLampList(this._entityFactory.get5ClosestLamps(this._gun, this._lamps, this._gun.getTransform().worldTranslation()))
      this.filterVisible(entity => entity instanceof Monster && 
        (entity as Monster).isTriggered())
      .forEach(monster => {
        (monster as Monster)
          .setLampList(this._entityFactory.get5ClosestLamps(monster, this._lamps))
      })
      this._lampSortingTimer = 0
    }
    this._lampSortingTimer += delta

    if(this._pathFindingCalculationTimer > 5) {
      this.filterVisible(entity => entity instanceof Monster && 
        (entity as Monster).isTriggered())
      .forEach(monster => {
          this._pathFinding.connectNearestNodesToPlayer()
          const path = this._pathFinding.find(monster as Monster);
          (monster as Monster).setPath(path)
        })
      this._pathFindingCalculationTimer = 0
    }
    this._pathFindingCalculationTimer += delta

  }

  public render(delta: number): void {
    this._frameBuffer[0].bind();
    super.render(delta);
    this._frameBuffer[0].unbind();
    this._frameBuffer[0].prepare();
    
    this._frameBuffer[1].bind();
    super.render(delta);
    this._frameBuffer[1].unbind();
    this._frameBuffer[1].renderBloom(delta);

    this._fading.getFrameBuffer().bind()
    this._frameBuffer[1].render(delta);
    this._fading.getFrameBuffer().unbind()
    this._fading.render(delta)
  }

}

export default MainScene