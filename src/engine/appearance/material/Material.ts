import IResource from '../IResource'
import Shader from '../Shader'

abstract class Material implements IResource {

  private _name: string
  private _shader: Shader
  
  public constructor (name: string, shader: Shader) {
    this._name = name
    this._shader = shader
  }

  public abstract create(): void;
  public abstract bind(): void;
  public abstract unbind(): void;
  public abstract destroy(): void;

  public getShader(): Shader {
    return this._shader
  }

  public setShader(shader: Shader): void {
    this._shader = shader
  }

  public getName(): string {
    return this._name
  }

  public setName(name: string): void {
    this._name = name
  }


}

export default Material