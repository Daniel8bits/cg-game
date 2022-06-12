import { Vector2, Vector3 } from "@math.gl/core";
import SolidEntity from "../../core/entities/SolidEntity";
import CircleHitbox from "../hitboxes/CircleHitbox";
import Intersection from "./Intersection";

class CircleCircleIntersection extends Intersection {

  public static test(solid1: SolidEntity, solid2: SolidEntity): CircleCircleIntersection {

    const p = new Vector2(
      solid1.getTransform().getTranslation().x,
      solid1.getTransform().getTranslation().z
    )

    const q = new Vector2(
      solid2.getTransform().getTranslation().x,
      solid2.getTransform().getTranslation().z
    )

    const totalRadius = (solid1.getHitbox() as CircleHitbox).getRadius() + 
      (solid2.getHitbox() as CircleHitbox).getRadius()

    if(q.distanceTo(p) < totalRadius) {
      return new CircleCircleIntersection(solid1, solid2)
    }

    return null;
  }

  public getAccelerationOnSolid1(): Vector3 {
    return this._getAccelerationOnSolid(this.getSolid1(), this.getSolid2());
  }

  public getAccelerationOnSolid2(): Vector3 {
    return this._getAccelerationOnSolid(this.getSolid2(), this.getSolid1());
  }

  private _getAccelerationOnSolid(solid1: SolidEntity, solid2: SolidEntity): Vector3 {
    const p = new Vector2(
      solid1.getTransform().getTranslation().x,
      solid1.getTransform().getTranslation().z
    )

    const q = new Vector2(
      solid2.getTransform().getTranslation().x,
      solid2.getTransform().getTranslation().z
    ) 

    const qp = new Vector2(q).subtract(p)
    const pq = new Vector2(p).subtract(q)

    const pRadius = (solid1.getHitbox() as CircleHitbox).getRadius()
    const qRadius = (solid2.getHitbox() as CircleHitbox).getRadius()

    const pk = new Vector2(p).add(qp.multiplyByScalar(pRadius).divideScalar(qp.magnitude()))
    const qk = new Vector2(q).add(pq.multiplyByScalar(qRadius).divideScalar(pq.magnitude()))

    const acceleration = qk.subtract(pk)

    return new Vector3(acceleration.x, 0, acceleration.y)
  }

  public solve(): void {

    const p = new Vector2(
      this.getSolid1().getTransform().getTranslation().x,
      this.getSolid1().getTransform().getTranslation().z
    )

    const q = new Vector2(
      this.getSolid2().getTransform().getTranslation().x,
      this.getSolid2().getTransform().getTranslation().z
    ) 

    const qp = new Vector2(p).subtract(q)

    const totalRadius = (this.getSolid1().getHitbox() as CircleHitbox).getRadius() +
      (this.getSolid2().getHitbox() as CircleHitbox).getRadius()

    qp.divideScalar(qp.magnitude())

    this.getSolid1().getTransform().setX(
      this.getSolid2().getTransform().getX() + totalRadius * qp.x
    )

    this.getSolid1().getTransform().setZ(
      this.getSolid2().getTransform().getZ() + totalRadius * qp.y
    )

  }

}

export default CircleCircleIntersection