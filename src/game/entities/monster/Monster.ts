import DynamicEntity from "@razor/core/entities/DynamicEntity";
import ResourceManager from "@razor/core/ResourceManager";
import CircleHitbox from "@razor/physics/hitboxes/CircleHitbox";
import Renderer from "@razor/renderer/Renderer";
import { IEntityWithLight } from "../IEntityWithLight";
import Lamp from "../Lamp";



class Monster extends DynamicEntity implements IEntityWithLight {

  private _lampList: Lamp[]

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
  }

  public update(time: number, delta: number): void {
    
  }


  public setLampList(lampList: Lamp[]): void {
    this._lampList = lampList
  }

  public getLampList(): Lamp[] {
    return this._lampList
  }

}

export default Monster