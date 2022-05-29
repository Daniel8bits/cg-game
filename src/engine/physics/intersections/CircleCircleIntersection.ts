import { Vector2 } from "@math.gl/core";
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

    if(q.distanceTo(p) <= totalRadius) {
      return new CircleCircleIntersection(solid1, solid2)
    }

    return null;
  }

}

export default CircleCircleIntersection