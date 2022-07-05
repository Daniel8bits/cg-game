import ResourceManager from "@razor/core/ResourceManager";
import Scene from "@razor/core/scenes/Scene";
import DisplayEntity from "src/game/entities/gui/DisplayEntity";
import SelectEntity from "src/game/entities/gui/common/SelectEntity";
import GameTest from "src/game/GameTest";
import GuiRenderer from "src/game/renderers/GuiRenderer";
import LoadingScene from "../LoadingScene";
import CreditsMenu from "./CreditsMenu";
import RectangleEntity from "src/game/entities/gui/common/RectangleEntity";
import Razor from "@razor/core/Razor";
import { Vector3 } from "@math.gl/core";
import FadingRenderer from "src/game/renderers/FadingRenderer";

class MainMenu extends Scene {

  static readonly MAIN_MENU: string = "main-menu"

  private _fading: FadingRenderer

  public constructor(renderer: GuiRenderer, fadingRenderer: FadingRenderer) {
    super(MainMenu.MAIN_MENU)
    this.getRenderStrategy().add(renderer)
    this._fading = fadingRenderer
    this.init(renderer)
  }

  private init(renderer: GuiRenderer): void {

    const select1 = new SelectEntity("select1", renderer);
    this.add(select1)
    select1.addOption("play").setExecute(() => {
      this._fading.fadeOut()
      setTimeout(() => {
        GameTest.getInstance().setScene(LoadingScene.LOADING_SCENE)
        ResourceManager.getSound("music").play(true);
      }, 1000)
    })
    select1.addOption("opcao 2")
    select1.addOption("credits").setExecute(() => {
      this._fading.fadeOut()
      setTimeout(() => {
        GameTest.getInstance().setScene(CreditsMenu.CREDITS_MENU);
      }, 1000)
      
    })

    this.onChange(() => {
      this._fading.fadeIn()
    })

  }

  public render(delta: number): void {
    this._fading.getFrameBuffer().bind()
    super.render(delta)
    this._fading.getFrameBuffer().unbind()
    this._fading.render(delta)
  }


}

export default MainMenu