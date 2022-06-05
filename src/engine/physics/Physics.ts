import { Vector3 } from '@math.gl/core'
import DynamicEntity from '@razor/core/entities/DynamicEntity'
import SolidEntity from '@razor/core/entities/SolidEntity'
import StaticEntity from '@razor/core/entities/StaticEntity'
import { PhysicsSceneProperties } from '@razor/core/scenes/PhysicsScene'
import CircleHitbox from './hitboxes/CircleHitbox'
import EdgeHitbox from './hitboxes/EdgeHitbox'
import CircleCircleIntersection from './intersections/CircleCircleIntersection'
import CircleEdgeIntersection from './intersections/CircleEdgeIntersection'
import Intersection from './intersections/Intersection'

class Physics {

  private _solidEntities: Array<SolidEntity>
  private _staticEntities: Array<StaticEntity>
  private _dynamicEntities: Array<DynamicEntity>

  private _intersections: Array<Intersection>

  public constructor() {
    this._solidEntities = []
    this._staticEntities = []
    this._dynamicEntities = []
    this._intersections = []
  }

  public add(entity: SolidEntity) {
    this._solidEntities.push(entity)
    if(entity instanceof StaticEntity) {
      this._staticEntities.push(entity)
    }
    else if(entity instanceof DynamicEntity) {
      this._dynamicEntities.push(entity)
    }
  }

  public remove(entity: SolidEntity) {
    this._solidEntities = this._solidEntities.filter(e => e.getName() !== entity.getName())
    if(entity instanceof StaticEntity) {
      this._staticEntities = this._staticEntities.filter(e => e.getName() !== entity.getName())
    }
    else if(entity instanceof DynamicEntity) {
      this._dynamicEntities = this._dynamicEntities.filter(e => e.getName() !== entity.getName())
    }
  }

  public applyPhysics(entity: DynamicEntity, sceneProperties: PhysicsSceneProperties, delta: number): void {
    
    entity.updateSpeed(delta)

    // apply gravity if suspended
    if(entity.getTransform().getY() < sceneProperties.defaultFakeFloor) {
      entity.getSpeed().add(new Vector3(0, sceneProperties.gravity*delta, 0))
    }
    // apply air resistance
    entity.getSpeed().add(new Vector3(entity.getSpeed())
    .multiplyByScalar(-sceneProperties.airFrictionCoefficient*delta))

    entity.getTransform().setTranslation(
      entity.getTransform().getTranslation().add(entity.getSpeed())
    )

    // fix gravity effect if surpasses ground
    if(entity.getTransform().getY() > sceneProperties.defaultFakeFloor) {
      entity.getSpeed().y = 0
      entity.getTransform().setY(sceneProperties.defaultFakeFloor)
    }
  }

  public reapplyPhysics(sceneProperties: PhysicsSceneProperties, delta: number): void {
    this._dynamicEntities.forEach(entity => this.applyPhysics(
      entity,
      sceneProperties,
      delta
    ))
  }

  public anyCollisionDetected(): boolean {

    this._intersections = []

    this._dynamicEntities.forEach((dynamicEntity) => {
      this._solidEntities.forEach((entity) => {

        if(dynamicEntity.getName() === entity.getName()) {
          return;
        }

        
        
        const intersection = this._test(dynamicEntity, entity)

        if(intersection) {
          this._intersections.push(intersection)
        }

      })
    })

    return this._intersections.length > 0

  }

  private _test(dynamicEntity: SolidEntity, entity: SolidEntity): Intersection {
    if(
      dynamicEntity.getHitbox() instanceof CircleHitbox &&
      entity.getHitbox() instanceof CircleHitbox
    ) {
      return CircleCircleIntersection.test(dynamicEntity, entity)
    }

    if(
      dynamicEntity.getHitbox() instanceof CircleHitbox &&
      entity.getHitbox() instanceof EdgeHitbox
    ) {
      return CircleEdgeIntersection.test(dynamicEntity, entity)
    }
  }

  public distributeForces(): void {

    this._intersections.forEach((intersection) => {

      const dynamicEntity = intersection.getSolid1() as DynamicEntity
      //const reflectedAcceleration = intersection.getAccelerationOnSolid1()
      intersection.solve()

      //dynamicEntity.setSpeed()
      /*
      dynamicEntity.getTransform().setTranslation(
        dynamicEntity.getTransform().getTranslation().subtract(reflectedAcceleration)
      )
      */
      //console.log(dynamicEntity.getTransform().getTranslation().distanceTo(intersection.getSolid2().getTransform().getTranslation()));

      dynamicEntity.getSpeed().x = 0;
      dynamicEntity.getSpeed().z = 0;

    })

  }

}



export default Physics