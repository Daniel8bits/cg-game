import { Vector3 } from "@math.gl/core";
import ResourceManager from "@razor/core/ResourceManager";
import Scene from "@razor/core/scenes/Scene";
import DialogEntity from "../entities/gui/common/DialogEntity";
import FadingRenderer from "../renderers/FadingRenderer";
import GuiRenderer from "../renderers/GuiRenderer";


class EndScene extends Scene {

  public static readonly END_SCENE: string = "end"

  private _fading: FadingRenderer

  public constructor(renderer: GuiRenderer, fadingRenderer: FadingRenderer) {
    super(EndScene.END_SCENE)
    this.getRenderStrategy().add(renderer)
    this._fading = fadingRenderer
    this.init(renderer)
  }

  private init(renderer: GuiRenderer): void {

    const endDisplay = new DialogEntity("endDisplay", renderer);
    this.add(endDisplay);
    endDisplay.getTransform().setTranslation(new Vector3(100, 100, -1).negate())
    //endDisplay.init()

    this.onChange(() => {
      this._fading.fadeIn()
      ResourceManager.forEachSound(sound => sound.pause())
      ResourceManager.getSound("elevator").play(false)
      const endDisplay = DialogEntity.Find("endDisplay");
      endDisplay.init();
      endDisplay.animateText("voce chegou no fim", 20, { vertical: '10%', horizontal: 'center' }, (display) => {
        setTimeout(() => {
          this._fading.fadeOut
        }, 4000);
        setTimeout(() => {
            display.remove()
            window.location.reload()
        }, 5000);
      });
    })

  }

  public render(delta: number): void {
    this._fading.getFrameBuffer().bind()
    super.render(delta)
    this._fading.getFrameBuffer().unbind()
    this._fading.render(delta)
  }

}

export default EndScene