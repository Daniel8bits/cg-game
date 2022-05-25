import Material from './Material'
import Texture from '../Texture'
import Shader from '../Shader'
import { gl } from '../../gl/GLUtils'

class DefaultMaterial extends Material {

  private _texture: Texture
  
  public constructor (name: string, shader: Shader, texture?: Texture) {
    super(name, shader)
    this._texture = texture
  }

  public create(): void {
    this.getShader().create()
    this._texture?.create()
  }

  public bind(): void {
    this.getShader().bind()
    if(this._texture){

      gl.activeTexture(gl.TEXTURE0);
      this._texture.bind();
      this.getShader().setInt('u_texture', 0)
    }
  }

  public unbind(): void {
    this._texture?.unbind()
    this.getShader().unbind()
  }

  public destroy(): void {
    this._texture?.destroy()
    this.getShader().destroy()
  }

  public getTexture(): Texture {
    return this._texture
  }

  public setTexture(texture: Texture): void {
    this._texture = texture
  }


}

export default DefaultMaterial