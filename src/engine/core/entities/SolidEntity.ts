import Material from "../../appearance/material/Material";
import VAO from "../../buffer/VAO";
import Hitbox from "../../physics/hitboxes/HitBox";
import Renderer from "../../renderer/Renderer";
import Entity from "./Entity";

abstract class SolidEntity extends Entity {

  private _hitbox: Hitbox;

  constructor(
    name: string, 
    hitbox: Hitbox,
    vao?: VAO, 
    material?: Material, 
    renderer?: Renderer
  ) {
    super(name, vao, material, renderer);
    this._hitbox = hitbox;
  }

  public setHitbox(hitbox: Hitbox) {
    this._hitbox = hitbox
  }

  public getHitbox(): Hitbox {
    return this._hitbox;
  }

}

export default SolidEntity