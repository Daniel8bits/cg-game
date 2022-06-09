import { Vector3 } from "@math.gl/core";
import VAO from "@razor/buffer/VAO";
import Entity from "@razor/core/entities/Entity";
import ResourceManager from "@razor/core/ResourceManager";
import Orientation from "@razor/math/Orientation";
import Transform from "@razor/math/Transform";
import Renderer from "@razor/renderer/Renderer";
import { IEntityWithLight } from "../IEntityWithLight";
import Lamp from "../Lamp";



class Gun extends Entity implements IEntityWithLight {

  private _sliderVao: VAO
  private _sliderTransform: Transform

  private _lampList: Lamp[]

  public constructor(renderer: Renderer) {
    super(
      'gun',
      ResourceManager.getVAO('gun-receiver'),
      ResourceManager.getMaterial('gun'),
      renderer
    )
    this._sliderVao = ResourceManager.getVAO('gun-slider')
    this._sliderTransform = new Transform()
    this._sliderTransform.parent = this.getTransform()
    this._lampList = []
    this.getTransform().setTranslation(new Vector3(-0.14, -0.23, -0.11))
    this.getTransform().setRotation(new Orientation(0, 0, -20))
  }

  public update(time: number, delta: number): void {
    
  }

  public getSliderVAO(): VAO {
    return this._sliderVao
  }

  public getSliderTransform(): Transform {
    return this._sliderTransform
  }
  
  public setLampList(lampList: Lamp[]): void {
    this._lampList = lampList
  }

  public getLampList(): Lamp[] {
    return this._lampList
  }

}

export default Gun