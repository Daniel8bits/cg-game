import Texture from "@razor/appearance/Texture";
import Razor from "@razor/core/Razor";
import { gl } from "@razor/gl/GLUtils";

class Buffer{

    private _buffer : WebGLFramebuffer;
    private _texture : Texture;

    constructor(width: number = Razor.CANVAS.width, height: number = Razor.CANVAS.height){
        this._buffer = gl.createFramebuffer();
        this._texture = new Texture(width, height)
    }

    public init(){
        this.bind();
        this._texture.create();
        this.bindTexture();
        this.unbind();
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

    public bind(){
        gl.bindFramebuffer(gl.FRAMEBUFFER,this._buffer)
    }

    public unbind(){
        gl.bindFramebuffer(gl.FRAMEBUFFER,null)
    }


    public getTexture() : Texture{
        return this._texture;
    }

    public getBuffer() : WebGLFramebuffer{
        return this._buffer;
    }

}

export default Buffer;