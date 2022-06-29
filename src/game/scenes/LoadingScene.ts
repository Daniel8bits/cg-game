import { Vector3 } from "@math.gl/core";
import ResourceManager from "@razor/core/ResourceManager";
import Scene from "@razor/core/scenes/Scene";
import DialogEntity from "../entities/gui/common/DialogEntity";
import GameTest from "../GameTest";
import GuiRenderer from "../renderers/GuiRenderer";

class LoadingScene extends Scene {

  public static readonly LOADING_SCENE: string = "loading"

  public constructor(renderer: GuiRenderer) {
    super(LoadingScene.LOADING_SCENE)
    this.getRenderStrategy().add(renderer)
    this.init(renderer)
  }

  private init(renderer: GuiRenderer): void {

    const loadingDisplay = new DialogEntity("loadingDisplay", renderer);
    this.add(loadingDisplay);
    loadingDisplay.getTransform().setTranslation(new Vector3(100, 100, -1).negate())
    loadingDisplay.init();

    this.onChange(() => {
      ResourceManager.getSound("elevator").play(false)
      DialogEntity.Find("loadingDisplay").animateText("bem vindo ao inferno", 50, { vertical: '10%', horizontal: 'center' }, function () {
          setTimeout(() => {
              this.remove()
              GameTest.getInstance().setScene("main");
          }, 5000);
      });
    })

  }

}

export default LoadingScene