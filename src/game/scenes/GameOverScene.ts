import { Vector3 } from "@math.gl/core";
import ResourceManager from "@razor/core/ResourceManager";
import Scene from "@razor/core/scenes/Scene";
import DialogEntity from "../entities/gui/common/DialogEntity";
import FadingRenderer from "../renderers/FadingRenderer";
import GuiRenderer from "../renderers/GuiRenderer";


class GameOverScene extends Scene {

  public static readonly GAMEOVER_SCENE: string = "gameover"

  private _fading: FadingRenderer

  public constructor(renderer: GuiRenderer, fadingRenderer: FadingRenderer) {
    super(GameOverScene.GAMEOVER_SCENE)
    this.getRenderStrategy().add(renderer)
    this._fading = fadingRenderer
    this.init(renderer)
  }

  private init(renderer: GuiRenderer): void {
    const gameoverDisplay = new DialogEntity("gameoverDisplay", renderer);
    this.add(gameoverDisplay);
    gameoverDisplay.getTransform().setTranslation(new Vector3(100, 100, -1).negate())
    gameoverDisplay.init();

    this.onChange(() => {
      this._fading.fadeIn()
      ResourceManager.forEachSound(sound => sound.pause())
      ResourceManager.getSound('death-track').play(true)
      gameoverDisplay.animateText("game over", 20, { vertical: '10%', horizontal: 'center' }, (dialog) => {
        setTimeout(() => {
          this._fading.fadeOut()
        }, 29000);
        setTimeout(() => {
          dialog.remove()
          window.location.reload()
        }, 30000);
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

export default GameOverScene