import Shader from "@razor/appearance/Shader";
import Texture from "@razor/appearance/Texture";
import { gl } from "@razor/gl/GLUtils";
import Razor from "../core/Razor";

class Framebuffer {

    private _fbo: WebGLFramebuffer;
    private _rbo: WebGLRenderbuffer;
    private _attachment: number;
    private _texture: Texture

    constructor(attachemnt: number, width: number = Razor.CANVAS.width, height: number = Razor.CANVAS.height) {
        this._attachment = attachemnt;
        this._texture = new Texture(width, height)
    }

    public bindTexture() {
        gl.bindTexture(gl.TEXTURE_2D, this._texture.getProgram());
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            this._texture.getWidth(),
            this._texture.getHeight(),
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }

    public create() {
        gl.viewport(0, 0, this._texture.getWidth(), this._texture.getHeight());
        // Create FBO
        this._fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo);

        // Create Texture
        this._texture.create();
        //this._texture.bind();
        this.bindTexture();
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            this._attachment,
            gl.TEXTURE_2D,
            this._texture.getProgram(),
            0
        );
        // Create RBO
        this._rbo = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this._rbo);

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
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
            console.log("Error at Framebuffer setting.");
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    public bind() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    public unbind() {
        //this.storeBuffer();
        this._texture.unbind()
        gl.viewport(0, 0, Razor.CANVAS.width, Razor.CANVAS.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // debugger;
    }


    public destroy() {
        gl.deleteFramebuffer(this._fbo);
        gl.deleteRenderbuffer(this._rbo);
    }

    public storeBuffer(): void {
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
    }

    public getTexture(): Texture {
        return this._texture
    }

    public getAttachemnt() : number{
        return this._attachment;
    }

}

export default Framebuffer