import { Vector2 } from "@math.gl/core"
import DynamicEntity from '@razor/core/entities/DynamicEntity';
import PathNode from './PathNode'

class EntityNode extends PathNode {

  private _entity: DynamicEntity

  public constructor(entity: DynamicEntity) {
    super(
      entity.getName(), 
      new Vector2(
        entity.getTransform().getTranslation().x,
        entity.getTransform().getTranslation().z,
      )
    );
    this._entity = entity  
  }

  public update(): void {
    this.getPosition().x = this._entity.getTransform().getTranslation().x
    this.getPosition().y = this._entity.getTransform().getTranslation().z
  }


}

export default EntityNode