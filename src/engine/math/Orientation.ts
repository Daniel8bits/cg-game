import {Vector3} from "@math.gl/core"

class Orientation extends Vector3 {

  public constructor(pitch: number = 0, yaw: number = 0, roll: number = 0) {
    super(pitch, yaw, roll)
  }

  public add(orientation: Orientation): Orientation {
    super.add(orientation)
    return this
  }
  
  public get pitch() : number {
    return this.x
  }

  public get yaw() : number {
    return this.y
  }

  public get roll() : number {
    return this.z
  }

  public set pitch(x: number) {
    this.x = x
  }

  public set yaw(y: number) {
    this.y = y
  }

  public set roll(z: number) {
    this.z = z
  }

}

export default Orientation