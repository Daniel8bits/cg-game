import { Vector3 } from "@math.gl/core";
import ResourceManager from "@razor/core/ResourceManager";
import Scene from "@razor/core/scenes/Scene";
import DialogEntity from "../entities/gui/common/DialogEntity";
import GuiRenderer from "../renderers/GuiRenderer";


class GameOverScene extends Scene {

  public static readonly GAMEOVER_SCENE: string = "gameover"

  public constructor(renderer: GuiRenderer) {
    super(GameOverScene.GAMEOVER_SCENE)
    this.getRenderStrategy().add(renderer)
    this.init(renderer)
  }

  private init(renderer: GuiRenderer): void {
    const gameoverDisplay = new DialogEntity("gameoverDisplay", renderer);
    this.add(gameoverDisplay);
    gameoverDisplay.getTransform().setTranslation(new Vector3(100, 100, -1).negate())

    this.onChange(() => {
      ResourceManager.forEachSound(sound => sound.pause())
      const gameoverDisplay = DialogEntity.Find("gameoverDisplay");
      gameoverDisplay.init();
      gameoverDisplay.animateText("game over", 20, { vertical: '10%', horizontal: 'center' }, (dialog) => {
          setTimeout(() => {
            dialog.remove()
            window.location.reload()
          }, 5000);
      });
    })

  }

}

export default GameOverScene