

abstract class Hitbox {

  private _collisionDisabled: boolean

  public constructor() {
    this._collisionDisabled = false
  }

  public isCollisionDisabled(): boolean {
    return this._collisionDisabled = true
  }

  public disableCollision(collisionDisabled: boolean): void {
    this._collisionDisabled = collisionDisabled
  }

}

export default Hitbox;