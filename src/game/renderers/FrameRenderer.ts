import { Matrix4, Vector3, cos } from "@math.gl/core"

import Renderer from "../../engine/renderer/Renderer";
import ResourceManager from "../../engine/core/ResourceManager";
import GLUtils, { gl } from "../../engine/gl/GLUtils";
import Entity from "../../engine/core/entities/Entity";
import CanvasCamera from '../CanvasCamera'
import { toRadians } from "@razor/math/math";
import Lamp from "../entities/Lamp";
import SimpleEntity from "../entities/SimpleEntity";
import SceneManager from "@razor/core/scenes/SceneManager";
import Texture from "@razor/appearance/Texture";
import Shader from "@razor/appearance/Shader";
import Camera from "@razor/core/Camera";
import Razor from "@razor/core/Razor";
import Framebuffer from "@razor/buffer/FrameBuffer";
import VAO from "@razor/buffer/VAO";

class FrameRenderer extends Renderer {

    private _frameBuffer : Framebuffer;
    private _shader : Shader;
    private _vao : VAO;

    constructor(cameraManager: Camera) {
        super('frameRenderer', cameraManager)
        this._frameBuffer = new Framebuffer();
        this._frameBuffer.create();
        this._shader = ResourceManager.getShader("effect");
        this._shader.create();
        this._vao = ResourceManager.getVAO("effect");
    }

    public get _texture() : Texture{
        return this._frameBuffer.getTexture();
    }

    public bind(){
        this._frameBuffer.bind();
    }

    public render(): void {
        this._shader.bind();
        gl.activeTexture(gl.TEXTURE0);
        this._texture.bind();
        this._shader.setInt('u_texture', 0)
        this._vao.bind();
        GLUtils.draw(this._vao.getLength())
        this._vao.unbind();
    }
    
    public unbind(){
        this._frameBuffer.unbind();
    }
}

export default FrameRenderer;