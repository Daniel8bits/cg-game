import Razor from "@razor/core/Razor";
import Scene from "@razor/core/scenes/Scene";
import CreditsEntity from "src/game/entities/gui/CreditsEntity";
import SelectEntity from "src/game/entities/gui/common/SelectEntity";
import GameTest from "src/game/GameTest";
import GuiRenderer from "src/game/renderers/GuiRenderer";
import MainMenu from "./MainMenu";


class CreditsMenu extends Scene {

  static readonly CREDITS_MENU: string = "credits-menu"

  public constructor(renderer: GuiRenderer) {
    super(CreditsMenu.CREDITS_MENU)
    this.getRenderStrategy().add(renderer)
    this.init(renderer)
  }

  private init(renderer: GuiRenderer): void {
    this.add(new CreditsEntity(renderer))
    const select = new SelectEntity("select", renderer, this);
    this.add(select)
    select.addOption("voltar").setExecute(() => {
        GameTest.getInstance().setScene(MainMenu.MAIN_MENU)
    })
    select.updateTranslation(Razor.CANVAS.width,Razor.CANVAS.height * 2 - 50);
  }

}

export default CreditsMenu