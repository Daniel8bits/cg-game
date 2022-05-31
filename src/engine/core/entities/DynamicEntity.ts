import { Vector3 } from "@math.gl/core";
import Material from "../../appearance/material/Material";
import VAO from "../../buffer/VAO";
import Hitbox from "../../physics/hitboxes/HitBox";
import Renderer from "../../renderer/Renderer";
import SolidEntity from "./SolidEntity";


abstract class DynamicEntity extends SolidEntity {

  private _mass: number;
  private _force: Vector3;
  private _speed: Vector3;

  constructor(
    name: string, 
    hitbox: Hitbox,
    mass: number,
    vao?: VAO, 
    material?: Material, 
    renderer?: Renderer
  ) {
    super(name, hitbox, vao, material, renderer);
    this._mass = mass;
    this._force = new Vector3(0, 0, 0);
    this._speed = new Vector3(0, 0, 0);
  }

  public updateSpeed(delta: number) {
    if(!this._force.exactEquals([0, 0, 0])) {
      this.updateSpeedByAcceleration(
        this._force.divideScalar(this._mass).multiplyByScalar(delta)
      )
    }
  }

  public updateSpeedByAcceleration(acceleration: Vector3) {
    this._speed.add(acceleration)
  }

  public setMass(mass: number) {
    this._mass = mass
  }

  public getMass(): number {
    return this._mass;
  }

  public setForce(force: Vector3) {
    this._force = force
  }

  public getForce(): Vector3 {
    return this._force
  }

  public setSpeed(speed: Vector3) {
    this._speed = speed
  }

  public getSpeed(): Vector3 {
    return this._speed
  }

}

export default DynamicEntity