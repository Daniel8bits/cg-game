import { gl } from "@razor/gl/GLUtils"
import Texture from "@razor/appearance/Texture";

class TextTexture extends Texture {

    private image: HTMLImageElement;

    constructor(image: HTMLImageElement) {
        super();
        this.image = image;
        this.create();
    }

    public bind(): void {
        super.bind();
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));
    }

    protected _bindData(): void {
        this.bind();
        gl.bindTexture(gl.TEXTURE_2D, this.getProgram());
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
}
export default TextTexture;