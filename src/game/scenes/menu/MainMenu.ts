import ResourceManager from "@razor/core/ResourceManager";
import Scene from "@razor/core/scenes/Scene";
import SelectEntity from "src/game/entities/gui/common/SelectEntity";
import GameTest from "src/game/GameTest";
import GuiRenderer from "src/game/renderers/GuiRenderer";
import LoadingScene from "../LoadingScene";
import CreditsMenu from "./CreditsMenu";

class MainMenu extends Scene {

  static readonly MAIN_MENU: string = "main-menu"

  public constructor(renderer: GuiRenderer) {
    super(MainMenu.MAIN_MENU)
    this.getRenderStrategy().add(renderer)
    this.init(renderer)
  }

  private init(renderer: GuiRenderer): void {

    const select1 = new SelectEntity("select1", renderer, this);
    this.add(select1)
    select1.addOption("play").setExecute(() => {
        GameTest.getInstance().setScene(LoadingScene.LOADING_SCENE)
        ResourceManager.getSound("music").play(true);
    })
    select1.addOption("opcao 2")
    select1.addOption("credits").setExecute(() => {
      GameTest.getInstance().setScene(CreditsMenu.CREDITS_MENU);
    })

  }

}

export default MainMenu