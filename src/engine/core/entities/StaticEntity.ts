import Material from "../../appearance/material/Material";
import VAO from "../../buffer/VAO";
import Hitbox from "../../physics/hitboxes/HitBox";
import Renderer from "../../renderer/Renderer";
import SolidEntity from "./SolidEntity";


abstract class StaticEntity extends SolidEntity {

  private _friction: number;

  constructor(
    name: string, 
    hitbox: Hitbox,
    friction: number,
    vao?: VAO, 
    material?: Material, 
    renderer?: Renderer
  ) {
    super(name, hitbox, vao, material, renderer);
    this._friction = friction;
  }

  public setFriction(friction: number) {
    this._friction = friction
  }

  public getFriction(): number {
    return this._friction;
  }

}

export default StaticEntity