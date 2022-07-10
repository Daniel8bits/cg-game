import { Vector3 } from "@math.gl/core";
import ResourceManager from "@razor/core/ResourceManager";
import Scene from "@razor/core/scenes/Scene";
import DialogEntity from "../entities/gui/common/DialogEntity";
import GameTest from "../GameTest";
import FadingRenderer from "../renderers/FadingRenderer";
import GuiRenderer from "../renderers/GuiRenderer";
import MainScene from "./MainScene";

class LoadingScene extends Scene {

  public static readonly LOADING_SCENE: string = "loading"

  private _fading: FadingRenderer

  public constructor(renderer: GuiRenderer, fadingRenderer: FadingRenderer) {
    super(LoadingScene.LOADING_SCENE)
    this.getRenderStrategy().add(renderer)
    this._fading = fadingRenderer
    this.init(renderer)
  }

  private init(renderer: GuiRenderer): void {

    const loadingDisplay = new DialogEntity("loadingDisplay", renderer);
    this.add(loadingDisplay);
    loadingDisplay.getTransform().setTranslation(new Vector3(100, 100, -1).negate())
    loadingDisplay.init();

    this.onChange(() => {
      this._fading.fadeIn()
      ResourceManager.getSound("elevator").play(false)
      DialogEntity.Find("loadingDisplay").animateText("underground factory", 20, { vertical: '10%', horizontal: 'center' }, (dialog) => {
        setTimeout(() => {
          dialog.remove()
        }, 2000);
      });
      setTimeout(() => {
        DialogEntity.Find("loadingDisplay").animateText("find the other elevator to escape", 20, { vertical: '10%', horizontal: 'center' }, (dialog) => {
          setTimeout(() => {
            this._fading.fadeOut()
          }, 4000);
          setTimeout(() => {
            dialog.remove()
            GameTest.getInstance().setScene(MainScene.NAME);
          }, 5000);
        })
      }, 4000);
    })

  }

  public render(delta: number): void {
    this._fading.getFrameBuffer().bind()
    super.render(delta)
    this._fading.getFrameBuffer().unbind()
    this._fading.render(delta)
  }

}

export default LoadingScene