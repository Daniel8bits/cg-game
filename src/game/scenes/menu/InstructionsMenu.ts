import { Vector3 } from "@math.gl/core";
import Razor from "@razor/core/Razor";
import Scene from "@razor/core/scenes/Scene";
import DialogEntity from "src/game/entities/gui/common/DialogEntity";
import SelectEntity from "src/game/entities/gui/common/SelectEntity";
import InstructionsEntity from "src/game/entities/gui/InstructionsEntity";
import GameTest from "src/game/GameTest";
import FadingRenderer from "src/game/renderers/FadingRenderer";
import GuiRenderer from "src/game/renderers/GuiRenderer";
import MainMenu from "./MainMenu";


class InstructionsMenu extends Scene {

  static readonly NAME: string = "instructions-menu"

  private _fading: FadingRenderer

  public constructor(renderer: GuiRenderer, fadingRenderer: FadingRenderer) {
    super(InstructionsMenu.NAME)
    this.getRenderStrategy().add(renderer)
    this._fading = fadingRenderer
    this.init(renderer)
  }

  private init(renderer: GuiRenderer): void {

    const instructionsDisplay = new DialogEntity("instructionsDisplay", renderer);
    this.add(instructionsDisplay);
    instructionsDisplay.getTransform().setTranslation(new Vector3(100, 100, -1).negate())
    instructionsDisplay.init();

    this.add(new InstructionsEntity(renderer))

    const select = new SelectEntity("select", renderer);
    this.add(select)
    select.addOption("back").setExecute(() => {
      this._fading.fadeOut()
      setTimeout(() => {
        GameTest.getInstance().setScene(MainMenu.MAIN_MENU)
      }, 1000)
    })
    select.updateTranslation(Razor.CANVAS.width,Razor.CANVAS.height * 2 - 50);

    this.onChange(() => {
      this._fading.fadeIn()
      DialogEntity.Find("instructionsDisplay").animateText("instructions", 20, { vertical: '10%', horizontal: 'center' });
    })
  }

  public render(delta: number): void {
    this._fading.getFrameBuffer().bind()
    super.render(delta)
    this._fading.getFrameBuffer().unbind()
    this._fading.render(delta)
  }

}

export default InstructionsMenu