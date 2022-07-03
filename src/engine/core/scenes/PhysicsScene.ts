import Physics from "@razor/physics/Physics";
import DynamicEntity from "../entities/DynamicEntity";
import Entity from "../entities/Entity";
import SolidEntity from "../entities/SolidEntity";
import Updater from "../updater/Updater";
import Scene from "./Scene";

export interface PhysicsSceneProperties {
  gravity: number;
  airFrictionCoefficient: number
  defaultFakeFloor: number;
}

class PhysicsScene extends Scene {

  private _properties: PhysicsSceneProperties

  private _physics: Physics

  public constructor(name: string) {
    super(name)
    this._physics = new Physics()
    this._properties = {
      gravity: 9.807,
      airFrictionCoefficient: 5,
      defaultFakeFloor: 0
    }
  }

  public add(entity: Entity, visible: boolean = true): Scene {
    super.add(entity, visible)
    if(entity instanceof SolidEntity && visible) {
      this._physics.add(entity)
    }
    return this
  }

  public remove(entity: Entity|string): Scene {
    if(entity instanceof SolidEntity && this.hasInVisible(entity)) {
      this._physics.remove(entity)
    }
    super.remove(entity)
    return this
  }

  public setVisibility(entity: Entity|string, visible: boolean): Scene|never {
    super.setVisibility(entity, visible)
    if(entity instanceof SolidEntity && visible) {
      this._physics.add(entity)
    } else if(entity instanceof SolidEntity && !visible) {
      this._physics.remove(entity)
    }
    return this
  }

  public update(time: number, delta: number, updater: Updater) {
    
    this.forEachVisible((entity) => {
      entity.update(time, delta, this, updater);
      if(entity instanceof DynamicEntity) {
        this._physics.applyPhysics(entity, this._properties, delta)
      }
    })

    if(this._physics.anyCollisionDetected()) {
      this._physics.distributeForces()
      //this._physics.reapplyPhysics(this._properties, delta)
    }

  }

  public getProperties(): PhysicsSceneProperties {
    return this._properties
  }

}

export default PhysicsScene