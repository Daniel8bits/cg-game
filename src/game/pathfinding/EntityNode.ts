import { Vector2 } from "@math.gl/core"
import DynamicEntity from '@razor/core/entities/DynamicEntity';
import PathNode from './PathNode'

class EntityNode extends PathNode {

  private _entity: DynamicEntity

  public constructor(entity: DynamicEntity) {
    super(
      entity.getName(), 
      null
    );
    this._entity = entity  
  }

  public getEntity(): DynamicEntity {
    return this._entity
  }

  public distanceTo(node: PathNode): number {
    return this.getPosition().distanceTo(node.getPosition())
  }

  public getPosition(): Vector2 {
    return new Vector2(
      this._entity.getTransform().getTranslation().x,
      this._entity.getTransform().getTranslation().z,
    )
  }


}

export default EntityNode