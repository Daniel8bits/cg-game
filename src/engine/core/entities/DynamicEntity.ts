import { Vector3 } from "@math.gl/core";
import Material from "../../appearance/material/Material";
import VAO from "../../buffer/VAO";
import Hitbox from "../../physics/hitboxes/HitBox";
import Renderer from "../../renderer/Renderer";
import SolidEntity from "./SolidEntity";


abstract class DynamicEntity extends SolidEntity {

  private _mass: number;
  private _force: Vector3;

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

}

export default DynamicEntity