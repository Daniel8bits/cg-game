import { Vector2, Vector3 } from "@math.gl/core";
import VAO from "@razor/buffer/VAO";
import Entity from "@razor/core/entities/Entity";
import ResourceManager from "@razor/core/ResourceManager";
import Scene from "@razor/core/scenes/Scene";
import { circunferenceEquationOf, intersectionPointsBetweenLineAndCircunference, lineEquationOf, PairPoints } from "@razor/math/math";
import Orientation from "@razor/math/Orientation";
import Transform from "@razor/math/Transform";
import CircleHitbox from "@razor/physics/hitboxes/CircleHitbox";
import Renderer from "@razor/renderer/Renderer";
import { IEntityWithLight } from "../IEntityWithLight";
import Lamp from "../Lamp";
import Monster from "../monster/Monster";

export enum GunState {
  READY,
  CHARGED,
  RECHARGING,
  EMPTY,
  LOADING,
}

class Gun extends Entity implements IEntityWithLight {

  private _state: GunState
  private _counter: number
  private _step: number

  private _sliderVao: VAO
  private _sliderTransform: Transform

  private _lampList: Lamp[]

  public constructor(renderer: Renderer, scene: Scene) {
    super(
      'gun',
      ResourceManager.getVAO('gun-receiver'),
      ResourceManager.getMaterial('gun'),
      renderer
    )
    this._sliderVao = ResourceManager.getVAO('gun-slider')
    this._sliderTransform = new Transform()
    this._sliderTransform.parent = this.getTransform()
    this._lampList = []
    this.getTransform().setTranslation(new Vector3(-0.14, -0.23, -0.11))
    this.getTransform().setRotation(new Orientation(0, 0, -20))
    this.setScene(scene)
    this._state = GunState.CHARGED
    this._counter = 0
    this._step = 1
  }

  public update(time: number, delta: number): void {

    if(this._state === GunState.RECHARGING && this._step === 1) {
      this._counter += 0.25;
      const sliderPosition = this._sliderTransform.getTranslation()
      this._sliderTransform.setTranslation(
        new Vector3().lerp(
          [sliderPosition.x, sliderPosition.y, 0],
          [sliderPosition.x, sliderPosition.y, .15],
          this._counter
        )
      )
      if(this._counter >= 1) {
        this._step = 2
        this._counter = 0
      }
    } else if(this._state === GunState.RECHARGING && this._step === 2) {
      this._counter += 0.25;
      const sliderPosition = this._sliderTransform.getTranslation()
      this._sliderTransform.setTranslation(
        new Vector3().lerp(
          [sliderPosition.x, sliderPosition.y, .15],
          [sliderPosition.x, sliderPosition.y, 0],
          this._counter
        )
      )
      if(this._counter >= 1) {
        this._step = 1
        this._counter = 0
        this._state = GunState.CHARGED
      }
    }
    
  }

  public shoot(playerPosition: Vector2, rayCasting: Vector2) {

    this._state = GunState.RECHARGING

    const bulletPath = lineEquationOf(playerPosition, rayCasting)

    const intersectionMap = new Map<string, PairPoints>()

    const getDistanceFromPlayer = (monster: Entity) => new Vector3(playerPosition.x, 0, playerPosition.y)
    .distanceTo(monster.getTransform().getTranslation())

    const monstersInTheSight = this.getScene()
      .filterVisible((entity) => entity instanceof Monster && getDistanceFromPlayer(entity) < 50)
      .sort((entity1, entity2) => {
        const distanceA = getDistanceFromPlayer(entity1)
        const distanceB = getDistanceFromPlayer(entity2)
        if(distanceA > distanceB) return 1;
        if(distanceA < distanceB) return -1;
        return 0;
      })
      .filter(entity => {
        const monsterPosition = entity.getTransform().getTranslation()
        const intersection = intersectionPointsBetweenLineAndCircunference(
          bulletPath,
          circunferenceEquationOf(
            new Vector2(monsterPosition.x, monsterPosition.z), 
            ((entity as Monster).getHitbox() as CircleHitbox).getRadius()
          )
        )
        if(intersection) {
          intersectionMap.set(entity.getName(), intersection)
          return true
        }
        return false
      }) as Monster[]

    for(let i = 0; i < monstersInTheSight.length; i++) {
      const intersection = intersectionMap.get(monstersInTheSight[i].getName())
      if(this._isInsideLine({p1: playerPosition, p2: rayCasting}, intersection)) {

        if(monstersInTheSight[i].takeDamage()) {
          this.getScene().remove(monstersInTheSight[i])
        }

        return;
      }

    }

  }

  private _isInsideLine(line: PairPoints, intersectionPoints: PairPoints): boolean {

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

  }

  public getSliderVAO(): VAO {
    return this._sliderVao
  }

  public getSliderTransform(): Transform {
    return this._sliderTransform
  }
  
  public setLampList(lampList: Lamp[]): void {
    this._lampList = lampList
  }

  public getLampList(): Lamp[] {
    return this._lampList
  }

  public getState(): GunState {
    return this._state
  }

}

export default Gun