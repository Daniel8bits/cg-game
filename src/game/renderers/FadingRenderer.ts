import Shader from "@razor/appearance/Shader";
import FrameBuffer from "@razor/buffer/FrameBuffer";
import VAO from "@razor/buffer/VAO";
import Camera from "@razor/core/Camera";
import Razor from "@razor/core/Razor";
import ResourceManager from "@razor/core/ResourceManager";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import Renderer from "@razor/renderer/Renderer";

export enum FadingRendererState {
  DONE,
  FADE_IN,
  FADE_OUT
}

class FadingRenderer extends Renderer {

  private _state: FadingRendererState
  private _frameBuffer: FrameBuffer
  private _shader: Shader
  private _vao: VAO

  private _fading: number

  public constructor(camera: Camera) {
    super("fading-renderer", camera)
    this._frameBuffer = new FrameBuffer(gl.COLOR_ATTACHMENT0, Razor.CANVAS.width, Razor.CANVAS.height);
    this._frameBuffer.create();
    this._shader = ResourceManager.getShader("fading");
    this._shader.create();
    this._vao = ResourceManager.getVAO("effect");
    this._fading = 0
  }

  public render(delta: number): void {

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this._shader.bind()
    gl.activeTexture(gl.TEXTURE0);
    this._frameBuffer.getTexture().bind()
    this._shader.setInt("u_albedo", 0)
    this._fade(delta)
    this._vao.bind()

    GLUtils.draw(this._vao.getLength())

    this._vao.unbind()
    this._frameBuffer.getTexture().unbind()
    this._shader.unbind()
    
    
  }

  private _fade(delta: number): void {
    if(this._state === FadingRendererState.FADE_OUT) {
      this._fading += delta //* 0.001
      if(this._fading >= 1) {
        this._fading = 1;
        this._state = FadingRendererState.DONE
      }
    } else if (this._state === FadingRendererState.FADE_IN) {
      this._fading += -delta //* 0.001
      if(this._fading <= 0) {
        this._fading = 0;
        this._state = FadingRendererState.DONE
      }
    }
    this._shader.setFloat("u_fading", this._fading)
  }

  public fadeIn(): void {
    this._state = FadingRendererState.FADE_IN
    this._fading = 1
  }

  public fadeOut(): void {
    this._state = FadingRendererState.FADE_OUT
    this._fading = 0
  }

  public getState(): FadingRendererState {
    return this._state
  }

  public getFrameBuffer(): FrameBuffer {
    return this._frameBuffer
  }
  

}

export default FadingRenderer