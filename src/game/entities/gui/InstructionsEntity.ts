import { Vector3 } from "@math.gl/core";
import DefaultMaterial from "@razor/appearance/material/DefaultMaterial";
import Entity from "@razor/core/entities/Entity";
import Razor from "@razor/core/Razor";
import ResourceManager from "@razor/core/ResourceManager";
import Scene from "@razor/core/scenes/Scene";
import Updater from "@razor/core/updater/Updater";
import Renderer from "@razor/renderer/Renderer";

class InstructionsEntity extends Entity {

  public static readonly CREDITS_ENTITY: string = "instructions-entity"

  public constructor(renderer: Renderer) {
    super(
      InstructionsEntity.CREDITS_ENTITY, 
      ResourceManager.getVAO("effect"),
      ResourceManager.getMaterial("instructions"), 
      renderer
    );
    
    this.getTransform().setTranslation(new Vector3(-Razor.CANVAS.width/2, -Razor.CANVAS.height/2, -1))
    this.getTransform().setScale(new Vector3(340, 170, 1))
    
  }

  public update(time: number, delta: number, currentScene : Scene, updater: Updater): void {
  }

    
}

export default InstructionsEntity