import { Vector2, Vector3 } from "@math.gl/core";
import DynamicEntity from "@razor/core/entities/DynamicEntity";
import ResourceManager from "@razor/core/ResourceManager";
import Scene from "@razor/core/scenes/Scene";
import Updater from "@razor/core/updater/Updater";
import CircleHitbox from "@razor/physics/hitboxes/CircleHitbox";
import Renderer from "@razor/renderer/Renderer";
import MainScene from "src/game/scenes/MainScene";
import PathNode from "../../pathfinding/PathNode";
import HUD from "../gui/hud/HUD";
import { IEntityWithLight } from "../IEntityWithLight";
import Lamp from "../Lamp";
import Player from "../player/Player";



class Monster extends DynamicEntity implements IEntityWithLight {

  private _lampList: Lamp[]
  
  private _health: number
  private _impulse: number
  
  private _path: PathNode[]
  private _pathIndex: number
  private _triggered: boolean
  private _player: Player

  private _hitPlayer : boolean;

  public constructor(name: string, renderer: Renderer, player: Player) {
    super(
      name,
      new CircleHitbox(1),
      1,
      ResourceManager.getVAO('monster'),
      ResourceManager.getMaterial('monster'),
      renderer
    )
    this._lampList = []
    this._path = []
    this._health = 5
    this._impulse = 40
    this._pathIndex = 0;
    this._triggered = false
    this._player = player
    this._hitPlayer = false;
  }

  public update(time: number, delta: number, currentScene : Scene, updater: Updater): void {
    if(Player.getInstance().getStop()) return;

    if(!this._triggered && this._shouldTrigger()) {
      
      this._triggered = true
      this.getHitbox().disableCollision(false);
      (currentScene as MainScene).calculatePathFinding(this)

    } else if (this._path.length > 0 && this._triggered) {

      this._updatePathIndex(this._path[this._pathIndex])
      this._move(this._path[this._pathIndex], delta)

      const distanceToPlayer = this.getTransform().getTranslation().distanceTo(Player.getInstance().getTransform().getTranslation());
      if(distanceToPlayer < 5 && !this._hitPlayer){
        this._hitPlayer = true;
        const monsterAttackSound = ResourceManager.getSound("monster-attack")
        monsterAttackSound.setOrigin(this.getTransform())
        monsterAttackSound.play(false, true);
        setTimeout(() => Player.getInstance().takeDamage(updater), 200)
        setTimeout(() => this._hitPlayer = false, 1000);
      }
      
    }

  }

  private _updatePathIndex(node: PathNode): void{
    if(this._pathIndex === this._path.length-1) {
      return;
    }
    const distance = node.getPosition().distanceTo(
      new Vector2(
        this.getTransform().getTranslation().x,
        this.getTransform().getTranslation().z
      )
    )
    if(distance < 2) {
      this._pathIndex++
    }
  }

  private _move(node: PathNode, delta: number) {

    this.getForce().x = 0
    this.getForce().y = 0
    this.getForce().z = 0
    
    const distanceVector = node.getPosition().clone().subtract(
      new Vector2(
        this.getTransform().getTranslation().x,
        this.getTransform().getTranslation().z
      )
    ).normalize()
    const x = distanceVector.x * this._impulse * delta;
    const z = distanceVector.y * this._impulse * delta;
    this.getForce().add(new Vector3(x, 0, z))
  }

  private _shouldTrigger(): boolean {
    return this._player.getTransform().getTranslation().distanceTo(this.getTransform().getTranslation()) <= 30
  }

  public takeDamage(): boolean {
    this._health--
    setTimeout(() => {
      let soundName = 'monster-damage'
      if(this._health === 0) {
        soundName = 'monster-death';
      }
      const sound = ResourceManager.getSound(soundName)
      sound.setOrigin(this.getTransform())
      sound.play(false, true)
    }, 200)
    return this._health === 0
  }

  public setLampList(lampList: Lamp[]): void {
    this._lampList = lampList
  }

  public getLampList(): Lamp[] {
    return this._lampList
  }

  public setHealth(health: number): void {
    this._health = health
  }

  public getHealth(): number {
    return this._health
  }

  public setPath(path: PathNode[]): void {
    const current = this._path[this._pathIndex]
    this._pathIndex = path.includes(current) ? path.indexOf(current) : 0;
    this._path = path
  }

  public getPath(): PathNode[] {
    return this._path
  }

  public isTriggered(): boolean {
    return this._triggered
  }

}

export default Monster