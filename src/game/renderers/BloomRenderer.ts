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
import FrameBuffer from "@razor/buffer/FrameBuffer";
import VAO from "@razor/buffer/VAO";
import Buffer from "@razor/buffer/Buffer";

type FrameRendererMode = 'albedo' | 'mascara';

class BloomRenderer extends Renderer {

    private static _modeStatic: FrameRendererMode;
    private _mode: FrameRendererMode;
    private _frameBuffer: FrameBuffer;
    private _shader: Shader;
    private _vao: VAO;
    private _buffers: FrameBuffer[] = [];
    private static _texture : Texture;
    private static _bloom : Texture;

    constructor(cameraManager: Camera, mode: FrameRendererMode, resolution: number) {
        super('frameRenderer', cameraManager)
        this._mode = mode;
        this._frameBuffer = new FrameBuffer(gl.COLOR_ATTACHMENT0, Razor.CANVAS.width*resolution, Razor.CANVAS.height*resolution);
        this._frameBuffer.create();
        this._shader = ResourceManager.getShader("effect");
        this._shader.create();
        this._vao = ResourceManager.getVAO("effect");
        this._buffers.push(new FrameBuffer(gl.COLOR_ATTACHMENT0, Razor.CANVAS.width*resolution, Razor.CANVAS.height*resolution));
        this._buffers.push(new FrameBuffer(gl.COLOR_ATTACHMENT0, Razor.CANVAS.width*resolution, Razor.CANVAS.height*resolution));

        //this._buffers[0].setResolution(0.25);
        //this._buffers[1].setResolution(0.25);

        this._buffers[0].create();
        this._buffers[1].create();
    }

    public get _texture(): Texture {
        return this._frameBuffer.getTexture();
    }

    public get attachemnt(): number {
        return this._frameBuffer.getAttachemnt();
    }

    public static get mode(): FrameRendererMode {
        return BloomRenderer._modeStatic;
    }

    public bind() {
        this._frameBuffer.bind();
        BloomRenderer._modeStatic = this._mode;
    }

    /*
    public render(): void {
        this._shader.bind();
        gl.activeTexture(gl.TEXTURE0);
        this._texture.bind();
        this._shader.setInt('u_texture', 0)
        this._vao.bind();
        const shader = this._shader;
        shader.setInt("mode", this._mode == "mascara" ? 1 : 0);
        if (this._mode == "albedo") {
            BloomRenderer._texture = this._texture;
            //this.draw();
        } else {
            shader.setFloat("weight[0]", 0.227027);
            shader.setFloat("weight[1]", 0.1945946);
            shader.setFloat("weight[2]", 0.1216216);
            shader.setFloat("weight[3]", 0.054054);
            shader.setFloat("weight[4]", 0.016216);
            shader.setFloat("sizeTexture[0]", this._texture.getWidth());
            shader.setFloat("sizeTexture[1]", this._texture.getHeight());

            let horizontal = true, first_iteration = true, amount = 10;
            for (let i = 0; i < amount; i++) {
                //
                this._buffers[Number(horizontal)].bind();
                shader.setInt("horizontal", Number(horizontal));
                if (!first_iteration) {
                    this._buffers[Number(!horizontal)].getTexture().bind();
                }
                this.draw();
                this._buffers[Number(horizontal)].unbind();
                horizontal = !horizontal;
                if (first_iteration) first_iteration = false;
            }
            shader.setInt("mode",2);
            gl.activeTexture(gl.TEXTURE0);
            BloomRenderer._texture.bind();
            this._shader.setInt('u_texture', 0)
            gl.activeTexture(gl.TEXTURE1);
            this._buffers[Number(!horizontal)].getTexture().bind();
            this._shader.setInt('u_mascara', 1)
            this.draw();
            BloomRenderer._modeStatic = "albedo";
        }
        this._vao.unbind();
        this._texture.unbind();
        this._shader.unbind();
    }
*/

    public prepare(): void {
        BloomRenderer._texture = this._frameBuffer.getTexture()
    }

    public renderBloom(delta: number): void {
        this._shader.bind();
        gl.activeTexture(gl.TEXTURE0);
        this._frameBuffer.getTexture().bind();
        this._shader.setInt('u_texture', 0)
        this._vao.bind();
        this._shader.setInt("mode", this._mode == "mascara" ? 1 : 0);

        this._shader.setFloat("weight[0]", 0.227027);
        this._shader.setFloat("weight[1]", 0.1945946);
        this._shader.setFloat("weight[2]", 0.1216216);
        this._shader.setFloat("weight[3]", 0.054054);
        this._shader.setFloat("weight[4]", 0.016216);
        this._shader.setFloat("sizeTexture[0]", this._texture.getWidth());
        this._shader.setFloat("sizeTexture[1]", this._texture.getHeight());

        let horizontal = true, first_iteration = true, amount = 10;
        for (let i = 0; i < amount; i++) {
            //
            this._buffers[Number(horizontal)].bind();
            this._shader.setFloat("u_horizontal", Number(horizontal));
            if (!first_iteration) {
                this._buffers[Number(!horizontal)].getTexture().bind();
            }
            this.draw();
            this._buffers[Number(horizontal)].unbind();
            horizontal = !horizontal;
            if (first_iteration) first_iteration = false;
        }

        BloomRenderer._bloom = this._buffers[Number(!horizontal)].getTexture();

        this._vao.unbind();
        this._frameBuffer.getTexture().unbind();
        this._shader.unbind();
    }

    public render(delta: number): void {
        this._shader.bind();
        gl.activeTexture(gl.TEXTURE0);
        this._frameBuffer.getTexture().bind();
        this._shader.setInt('u_texture', 0)
        this._vao.bind();
        this._shader.setInt("mode", this._mode == "mascara" ? 1 : 0);

        this._shader.setInt("mode",2);
        gl.activeTexture(gl.TEXTURE0);
        BloomRenderer._texture.bind();
        this._shader.setInt('u_texture', 0)
        gl.activeTexture(gl.TEXTURE1);
        BloomRenderer._bloom.bind()
        this._shader.setInt('u_mascara', 1)

        this.draw();

        this._vao.unbind();
        this._frameBuffer.getTexture().unbind();
        this._shader.unbind();
    }

    public draw() {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        GLUtils.draw(this._vao.getLength())
    }

    public unbind() {
        this._frameBuffer.unbind();
    }

    public getFrameBuffer(): FrameBuffer {
        return this._frameBuffer
    }
}

export default BloomRenderer;