import Shader from "@razor/appearance/Shader";
import Texture from "@razor/appearance/Texture";
import { gl } from "@razor/gl/GLUtils";
import Razor from "../core/Razor";

class Framebuffer {

    private _fbo: WebGLFramebuffer;
    private _rbo: WebGLRenderbuffer;

    private _texture: Texture

    constructor(width: number = Razor.CANVAS.width, height: number = Razor.CANVAS.height) {
        this._texture = new Texture(width, height) 
    }

    public create() {
        this._fbo = gl.createFramebuffer();
        this._rbo = gl.createRenderbuffer();
        this._texture.create();
    }

    public bind() {
        this._texture.bind();
        gl.viewport(0, 0, this._texture.getWidth(), this._texture.getHeight());

        gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo);
        gl.bindRenderbuffer(gl.RENDERBUFFER, this._rbo);

        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            this._texture.getProgram(),
            0
        );

        gl.renderbufferStorage(
            gl.RENDERBUFFER,
            gl.DEPTH_COMPONENT16,
            this._texture.getWidth(),
            this._texture.getHeight()
        );

        gl.framebufferRenderbuffer(
            gl.FRAMEBUFFER,
            gl.DEPTH_ATTACHMENT,
            gl.RENDERBUFFER,
            this._rbo
        );
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);
    }

    public unbind() {

        const data = new Uint8Array(this._texture.getWidth() * this._texture.getHeight() * 4)
  
        gl.readPixels(
          0, 
          0,
          this._texture.getWidth(),
          this._texture.getHeight(),
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          data
        )
        this._texture.setData(data);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this._texture.unbind()
        gl.viewport(0, 0, Razor.CANVAS.width, Razor.CANVAS.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }


    public destroy() {
        gl.deleteFramebuffer(this._fbo);
        gl.deleteRenderbuffer(this._rbo);
    }

    public getTexture(): Texture {
        return this._texture
    }

}

export default Framebuffer