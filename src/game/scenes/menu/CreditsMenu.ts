import Razor from "@razor/core/Razor";
import Scene from "@razor/core/scenes/Scene";
import CreditsEntity from "src/game/entities/gui/CreditsEntity";
import SelectEntity from "src/game/entities/gui/common/SelectEntity";
import GameTest from "src/game/GameTest";
import GuiRenderer from "src/game/renderers/GuiRenderer";
import MainMenu from "./MainMenu";
import FadingRenderer from "src/game/renderers/FadingRenderer";


class CreditsMenu extends Scene {

  static readonly CREDITS_MENU: string = "credits-menu"

  private _fading: FadingRenderer

  public constructor(renderer: GuiRenderer, fadingRenderer: FadingRenderer) {
    super(CreditsMenu.CREDITS_MENU)
    this.getRenderStrategy().add(renderer)
    this._fading = fadingRenderer
    this.init(renderer)
  }

  private init(renderer: GuiRenderer): void {
    this.add(new CreditsEntity(renderer))
    const select = new SelectEntity("select", renderer);
    this.add(select)
    select.addOption("voltar").setExecute(() => {
      this._fading.fadeOut()
      setTimeout(() => {
        GameTest.getInstance().setScene(MainMenu.MAIN_MENU)
      }, 1000)
    })
    select.updateTranslation(Razor.CANVAS.width,Razor.CANVAS.height * 2 - 50);

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

export default CreditsMenu