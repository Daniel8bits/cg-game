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

    constructor(cameraManager: Camera,attachemnt: number) {
        super('frameRenderer', cameraManager)
        this._frameBuffer = new Framebuffer(attachemnt);
        this._frameBuffer.create();
        this._shader = ResourceManager.getShader("effect");
        this._shader.create();
        this._vao = ResourceManager.getVAO("effect");
    }

    public get _texture() : Texture{
        return this._frameBuffer.getTexture();
    }

    public get attachemnt() : number{
        return this._frameBuffer.getAttachemnt();
    }

    public bind(){
        this._frameBuffer.bind();
    }

    public render(): void {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this._shader.bind();
        gl.activeTexture(gl.TEXTURE0);
        this._texture.bind();
        this._shader.setInt('u_texture', 0)
        this._vao.bind();
        GLUtils.draw(this._vao.getLength())
        this._vao.unbind();
        this._texture.unbind();
        this._shader.unbind();
    }
    
    public unbind(){
        this._frameBuffer.unbind();
    }
}

export default FrameRenderer;