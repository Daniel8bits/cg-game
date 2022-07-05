import { Matrix4, toRadians, Vector3 } from "@math.gl/core";
import Orientation from "./Orientation";


class TransformStruct {

  public translation: Vector3;
  public rotation: Orientation;
  public scale: Vector3;

  public constructor(translation?: Vector3, rotation?: Orientation, scale?: Vector3) {
    this.translation = translation ?? new Vector3()
    this.rotation = rotation ?? new Orientation()
    this.scale = scale ?? new Vector3(1, 1, 1)  
  }

  public toMatrix() : Matrix4 {
    return this._toMatrix(this.translation.clone().negate())    
  }

  public toMatrixIgnoringZ(): Matrix4 {
    return this._toMatrix(new Vector3(
      this.translation.x,
      this.translation.y,
      0
    ).negate())
  }

  public toInversePositionMatrix() : Matrix4 {
    return this._toMatrix(this.translation.clone())
  }

  private _toMatrix(translationVector: Vector3): Matrix4 {
    const translation = new Matrix4().translate(translationVector);

    const rotationX = new Matrix4().rotateX(toRadians(this.rotation.pitch))
    const rotationY = new Matrix4().rotateY(toRadians(this.rotation.yaw))
    const rotationZ = new Matrix4().rotateZ(toRadians(this.rotation.roll))

    const rotation = rotationX.multiplyRight(rotationY.multiplyRight(rotationZ))

    const scale = new Matrix4().scale(this.scale);

    return translation.multiplyRight(rotation.multiplyRight(scale))
  }

}

export default TransformStruct