import { Vector3 } from "@math.gl/core";
import Razor from "@razor/core/Razor";
import IUpdatable from "@razor/core/updater/IUpdatable";
import Updater from "@razor/core/updater/Updater";
import GuiRenderer from "src/game/renderers/GuiRenderer";
import GameOverScene from "src/game/scenes/GameOverScene";
import MainScene from "src/game/scenes/MainScene";
import DialogEntity from "../common/DialogEntity";
import ImageEntity from "../common/ImageEntity";
import DisplayEntity from "../DisplayEntity";

class HUD implements IUpdatable {

  public static readonly NAME = "hud"

  private _scene: MainScene

  // hud objects
  private _life: DisplayEntity
  private _ammo: DisplayEntity

  // values
  private _lifeValue: number
  private _ammoValue: number

  public constructor(scene: MainScene) {
    this._scene = scene
    this._init(scene.getRenderStrategy().get("guirenderer") as GuiRenderer)
  }

  private _init(renderer: GuiRenderer): void {

    this._ammo = new DisplayEntity('guiAmmunition', renderer);
    const bottom = -Razor.CANVAS.height + 100;
    this._scene.add(this._ammo);
    this._ammo.getTransform().setTranslation(new Vector3(0, bottom, 0));
    this.setAmmo(100)
    // https://www.pngwing.com/pt/free-png-stupy/download
    this._ammo.setImage(new ImageEntity("ammunition", "/resources/images/ammunition.png", renderer));

    this._life = new DisplayEntity('guiLife', renderer);
    this._scene.add(this._life);
    this._life.getTransform().setTranslation(new Vector3(0, bottom - 50, 0));
    this.setLife(100)
    //https://www.onlinewebfonts.com/icon/146242
    this._life.setImage(new ImageEntity("life", "/resources/images/life.png", renderer));

    const dialog = new DialogEntity("display", renderer);
    this._scene.add(dialog);
    dialog.getTransform().setTranslation(new Vector3(100, 100, -1).negate())
    dialog.init();

  }

  public update(time: number, delta: number, updater: Updater): void {
    if(this._lifeValue === 0){
      //GameTest.getInstance().setScene(GameOverScene.GAMEOVER_SCENE);
      this._scene.gameOver(GameOverScene.GAMEOVER_SCENE)
    }
  }

  public decrementLife(amount: number = 1): void {
    const newLife = this._lifeValue - amount
    this.setLife(newLife >= 0 ? newLife : 0)
  }

  public setLife(life: number): void {
    this._lifeValue = life
    if(!this._life.exists()) {
      this._life.setText(String(life), new Vector3(1, 0.2, 0.2))
      return
    }
    this._life.updateText(life)
  }

  public getLife(): number {
    return this._lifeValue
  }

  public decrementAmmo(amount: number = 1): void {
    const newAmmo = this._ammoValue - amount
    this.setAmmo(newAmmo >= 0 ? newAmmo : 0)
  }

  public setAmmo(ammo: number): void {
    this._ammoValue = ammo
    if(!this._ammo.exists()) {
      this._ammo.setText(String(ammo), new Vector3(0.2, 0.9, 0.9))
      return
    }
    this._ammo.updateText(ammo)
  }

  public getAmmo(): number {
    return this._ammoValue
  }

  public getName(): string {
    return HUD.NAME
  }

}

export default HUD