import DynamicEntity from "@razor/core/entities/DynamicEntity";
import ResourceManager from "@razor/core/ResourceManager";
import CircleHitbox from "@razor/physics/hitboxes/CircleHitbox";
import Renderer from "@razor/renderer/Renderer";
import Sound from "src/game/Sound";
import { IEntityWithLight } from "../IEntityWithLight";
import Lamp from "../Lamp";



class Monster extends DynamicEntity implements IEntityWithLight {

  private _lampList: Lamp[]

  private _health: number

  public constructor(name: string, renderer: Renderer) {
    super(
      name,
      new CircleHitbox(1),
      1,
      ResourceManager.getVAO('monster'),
      ResourceManager.getMaterial('monster'),
      renderer
    )
    this._lampList = []
    this._health = 5
  }

  public update(time: number, delta: number): void {
   // Sound.Find("gun").play(true,-1,this.getTransform().getTranslation())
  }

  public takeDamage(): boolean {
    this._health--
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

}

export default Monster