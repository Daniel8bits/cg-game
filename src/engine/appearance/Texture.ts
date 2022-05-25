import { gl } from "../gl/GLUtils"
import IResource from "./IResource"

export interface TextureType {
  name: string
  pathname?: string
  texture?: Texture | (() => Texture)
}

class Texture implements IResource{

  private _program: WebGLTexture
  private _width: number
  private _height: number

  private _created: boolean

  private _data: Uint8Array

  public constructor(width: number = 0, height: number = 0, data: Uint8Array = null) {
    this._width = width
    this._height = height
    this._data = data
    this._created = false
    const observer = setInterval(() => {
      if(this._created && this._data) {
        console.log(this);
        
        this._bindData()
        clearInterval(observer)
      }
    }, 100)
  }

  public create() {

    this._program = gl.createTexture();

    if(this._data) {
      this._bindData()
    }
    
    if((this._width < 1 || this._height < 1) && this._data) {
      throw new Error("Invalid image size!")
    }

    this._created = true

  }

  public bind() {
    gl.bindTexture(gl.TEXTURE_2D, this._program);
    
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  public unbind() {
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  public destroy() {
    gl.deleteTexture(this._program)
  }

  public getWidth(): number {
    return this._width
  }

  public getHeight(): number {
    return this._height
  }

  public setWidth(width: number): void {
    this._width = width
  }

  public setHeight(height: number): void {
    this._height = height
  }

  public getData(): Uint8Array {
    return this._data
  }

  public setData(data?: Uint8Array): void {

    if(data) {
      delete this._data
      this._data = data
    }

    if(this._created) {
      this._bindData()
    }
    
  }

  protected _bindData(): void {
    this.bind()
    gl.texImage2D(
      gl.TEXTURE_2D, 
      0, 
      gl.RGBA, 
      this._width, 
      this._height, 
      0, 
      gl.RGBA, 
      gl.UNSIGNED_BYTE, 
      this._data
    );
    
  }

  public getProgram(): WebGLTexture {
    return this._program
  }

  
}

export default Texture