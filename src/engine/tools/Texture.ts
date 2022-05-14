import { gl } from "../gl/GLUtils"
import IResource from "./IResource"

export interface TextureType {
  name: string
  pathname: string
}


type TextureDataType = Uint8Array | HTMLImageElement

class Texture implements IResource{

  private _program: WebGLTexture
  private _width: number
  private _height: number

  private _data: TextureDataType

  public constructor(width: number = 0, height: number = 0, data: TextureDataType = null) {
    this._width = width
    this._height = height
    this._data = data
  }

  public create() {

    this._program = gl.createTexture();

    if((this._width < 1 || this._height < 1) && this._data) {
      throw new Error("Invalid image size!")
    }

  }

  public bind() {
    gl.bindTexture(gl.TEXTURE_2D, this._program);
    
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

  public getData(): TextureDataType {
    return this._data
  }

  public setData(data: TextureDataType): void {
    delete this._data
    this._data = data

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
      this._data as ArrayBufferView
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  public getProgram(): WebGLTexture {
    return this._program
  }

  
}

export default Texture