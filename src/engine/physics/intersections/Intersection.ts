import { Vector3 } from "@math.gl/core";
import SolidEntity from "../../core/entities/SolidEntity";

abstract class Intersection {

  private _solid1: SolidEntity 
  private _solid2: SolidEntity

  protected constructor(solid1: SolidEntity, solid2: SolidEntity) {
    this._solid1 = solid1
    this._solid2 = solid2
  }

  public getSolid1(): SolidEntity {
    return this._solid1
  }

  public getSolid2(): SolidEntity {
    return this._solid2
  }

  public abstract getAccelerationOnSolid1(): Vector3;

  public abstract getAccelerationOnSolid2(): Vector3;

}

export default Intersection