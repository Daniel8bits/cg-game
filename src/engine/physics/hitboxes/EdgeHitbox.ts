import { Vector2 } from "@math.gl/core"
import Hitbox from "./HitBox"

export class Line {

  private _p: Vector2
  private _q: Vector2

  public constructor(p: Vector2, q: Vector2) {
    this._p = p
    this._q = q
  }

  public getP(): Vector2 { 
    return this._p
  }

  public getQ(): Vector2 { 
    return this._q
  }
}

class EdgeHitbox extends Hitbox {

  private _lines: Line[]

  public constructor(vertices: number[], indices: number[]) {
    super()
    this._lines = []

    for(let i = 0; i < indices.length; i+=2) {
      const ax = vertices[indices[i]*2];
      const az = vertices[indices[i]*2+1];
      const bx = vertices[indices[i+1]*2];
      const bz = vertices[indices[i+1]*2+1];
      this._lines.push(new Line(new Vector2(ax, az), new Vector2(bx, bz)))
    }
    
  }

  public getLines(): Line[] { 
    return this._lines
  }

}

export default EdgeHitbox