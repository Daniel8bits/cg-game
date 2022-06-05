import { Vector2, Vector3 } from "@math.gl/core";
import SolidEntity from "../../core/entities/SolidEntity";
import { 
  circunferenceEquationOf,
  distanceBetweenPointAndLine, 
  intersectionPointsBetweenLineAndCircunference, 
  LineEquation, 
  lineEquationOf, 
  PairPoints
} from "../../math/math";
import CircleHitbox from "../hitboxes/CircleHitbox";
import EdgeHitbox, {Line} from "../hitboxes/EdgeHitbox";
import Intersection from "./Intersection";

interface CircleLineIntersection {
  p: Vector2,
  q: Vector2,
  distance: number,
  intersectionPoints: PairPoints,
  circleCenter: Vector2
}

class CircleEdgeIntersection extends Intersection {

  private _intersectedLine: CircleLineIntersection

  private constructor(solid1: SolidEntity, solid2: SolidEntity, intersectedLine: CircleLineIntersection) {
    super(solid1, solid2);
    this._intersectedLine = intersectedLine
  }

  public static test(solid1: SolidEntity, solid2: SolidEntity): CircleEdgeIntersection {

    const s1P = new Vector2(
      solid1.getTransform().getTranslation().x,
      solid1.getTransform().getTranslation().z
    )

    const transform = solid2.getTransform().toInversePositionMatrix()

    const circleHitbox = (solid1.getHitbox() as CircleHitbox)
    const edgeHitbox = (solid2.getHitbox() as EdgeHitbox)

    const intersectedLines: CircleLineIntersection[] = []
    
    edgeHitbox.getLines().forEach((line) => {
      const p: Vector3 = new Vector3(line.getP().x, 0, line.getP().y).transform(transform)
      const q: Vector3 = new Vector3(line.getQ().x, 0, line.getQ().y).transform(transform)

      const lineEquation = lineEquationOf(new Vector2(p.x, p.z), new Vector2(q.x, q.z))
      
      const distance = distanceBetweenPointAndLine(s1P, lineEquation)

      if(distance < circleHitbox.getRadius()) {
        
        const intersectionPoints = intersectionPointsBetweenLineAndCircunference(
          lineEquation,
          circunferenceEquationOf(
            s1P, 
            circleHitbox.getRadius()
          )
        )

        if(intersectionPoints &&
          CircleEdgeIntersection._isInsideLine(
            {p1: new Vector2(p.x, p.z), p2: new Vector2(q.x, q.z)},
            intersectionPoints
          )
        ) {

          intersectedLines.push({
            p: new Vector2(p.x, p.z), 
            q: new Vector2(q.x, q.z), 
            distance, 
            intersectionPoints,
            circleCenter: s1P
          })

        }

      }
    })

    if(intersectedLines.length > 0) {
      
      
      intersectedLines.sort((a, b) => a.distance - b.distance)
      
      return new CircleEdgeIntersection(solid1, solid2, intersectedLines[0])
    }

    return null;
  }

  public solve(): void {

    const closestPoint = new Vector2(this._intersectedLine.intersectionPoints.p2)
      .subtract(this._intersectedLine.intersectionPoints.p1)
      .divideScalar(2).add(this._intersectedLine.intersectionPoints.p1)

    const reflectorCircleCenter = new Vector2(closestPoint)
      .subtract(this._intersectedLine.circleCenter)
      .multiplyByScalar(2)
    
    const qp = new Vector2(reflectorCircleCenter).negate()

    reflectorCircleCenter.add(this._intersectedLine.circleCenter)

    const totalRadius = (this.getSolid1().getHitbox() as CircleHitbox).getRadius() +
      closestPoint.distanceTo(reflectorCircleCenter)

    qp.divideScalar(qp.magnitude())

    this.getSolid1().getTransform().setX(
      reflectorCircleCenter.x + totalRadius * qp.x
    )

    this.getSolid1().getTransform().setZ(
      reflectorCircleCenter.y + totalRadius * qp.y
    )
    

  }

  private static _isInsideLine(line: PairPoints, intersectionPoints: PairPoints): boolean {

    let begin = 0, end = 0

    if(line.p1.x !== line.p2.x) {
      if(line.p1.x < line.p2.x) {
        begin = line.p1.x
        end = line.p2.x
      }
      else {
        begin = line.p2.x
        end = line.p1.x
      }

      return (intersectionPoints.p1.x > begin && intersectionPoints.p1.x < end) || (intersectionPoints.p2.x > begin && intersectionPoints.p2.x < end)
    }

    if(line.p1.y < line.p2.y) {
      begin = line.p1.y
      end = line.p2.y
    }
    else {
      begin = line.p2.y
      end = line.p1.y
    }

    return (intersectionPoints.p1.y > begin && intersectionPoints.p1.y < end) || (intersectionPoints.p2.y > begin && intersectionPoints.p2.y < end)

/*
    const AB = line.p1.distanceTo(line.p2)
    const p1A = intersectionPoints.p1.distanceTo(line.p1)
    const p1B = intersectionPoints.p1.distanceTo(line.p2)
    const p2A = intersectionPoints.p2.distanceTo(line.p1)
    const p2B = intersectionPoints.p2.distanceTo(line.p2)

    return (p1A+p1B <= AB) || (p2A+p2B <= AB)
*/

  }

}

export default CircleEdgeIntersection