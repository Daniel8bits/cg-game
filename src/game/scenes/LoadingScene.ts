import { Vector3 } from "@math.gl/core";
import Scene from "@razor/core/scenes/Scene";
import DialogEntity from "../entities/gui/common/DialogEntity";
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

  }

}

export default LoadingScene