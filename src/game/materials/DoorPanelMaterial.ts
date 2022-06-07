import Material from '@razor/appearance/material/Material'
import Shader from '@razor/appearance/Shader'
import Texture from '@razor/appearance/Texture'
import ResourceManager from '@razor/core/ResourceManager'
import { gl } from '@razor/gl/GLUtils'

class DoorPanelMaterial extends Material {

  private _lockedTexture: Texture
  private _unlockedTexture: Texture
  private _displayMap: Texture

  private _locked: boolean
  
  public constructor () {
    super('door-panel', ResourceManager.getShader('door-panel'))
    this._lockedTexture = ResourceManager.getTexture('door-panel-locked')
    this._unlockedTexture = ResourceManager.getTexture('door-panel-unlocked')
    this._displayMap = ResourceManager.getTexture('door-panel-display-map')
    this._locked = true;
  }

  public create(): void {
    this.getShader().create()
    this._lockedTexture.create()
    this._unlockedTexture.create()
    this._displayMap.create()
  }
  public bind(): void {
    this.getShader().bind()
    gl.activeTexture(gl.TEXTURE0);
    this._lockedTexture.bind()
    this.getShader().setInt('u_lockedTexture', 0)
    gl.activeTexture(gl.TEXTURE1);
    this._unlockedTexture.bind()
    this.getShader().setInt('u_unlockedTexture', 1)
    gl.activeTexture(gl.TEXTURE2);
    this._displayMap.bind()
    this.getShader().setInt('u_displayMap', 2)
    this.getShader().setInt('u_locked', Number(this._locked))
  }
  public unbind(): void {
    this._displayMap.unbind()
    this._unlockedTexture.unbind()
    this._lockedTexture.unbind()
    this.getShader().unbind()
  }
  public destroy(): void {
    this._displayMap.destroy()
    this._unlockedTexture.destroy()
    this._lockedTexture.destroy()
    this.getShader().destroy()
  }

  public setLocked(locked: boolean): void {
    this._locked = locked
  }

}

export default DoorPanelMaterial