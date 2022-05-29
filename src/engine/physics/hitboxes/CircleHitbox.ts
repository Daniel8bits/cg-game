import Hitbox from "./HitBox"


class CircleHitbox extends Hitbox {

  private _radius: number

  public constructor(radius: number) {
    super()
    this._radius = radius 
  }

  public getRadius(): number {
    return this._radius
  }

}

export default CircleHitbox