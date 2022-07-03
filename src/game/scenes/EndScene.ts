import { Vector3 } from "@math.gl/core";
import ResourceManager from "@razor/core/ResourceManager";
import Scene from "@razor/core/scenes/Scene";
import DialogEntity from "../entities/gui/common/DialogEntity";
import GuiRenderer from "../renderers/GuiRenderer";


class EndScene extends Scene {

  public static readonly END_SCENE: string = "end"

  public constructor(renderer: GuiRenderer) {
    super(EndScene.END_SCENE)
    this.getRenderStrategy().add(renderer)
    this.init(renderer)
  }

  private init(renderer: GuiRenderer): void {

    const endDisplay = new DialogEntity("endDisplay", renderer);
    this.add(endDisplay);
    endDisplay.getTransform().setTranslation(new Vector3(100, 100, -1).negate())
    //endDisplay.init()

    this.onChange(() => {
      ResourceManager.forEachSound(sound => sound.pause())
      ResourceManager.getSound("elevator").play(false)
      const endDisplay = DialogEntity.Find("endDisplay");
      endDisplay.init();
      endDisplay.animateText("voce chegou no fim", 20, { vertical: '10%', horizontal: 'center' }, function () {
          setTimeout(() => {
              this.remove()
              window.location.reload()
          }, 5000);
      });
    })

  }

}

export default EndScene