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

class FrameRenderer extends Renderer {

    private _framebuffer: WebGLFramebuffer
    private _depthBuffer: WebGLFramebuffer
    private _sceneManager: SceneManager
    private _texture: Texture
    private _shader: Shader

    private _projection: Matrix4;
    private _cameraManager: Camera

    private _id: number

    constructor(cameraManager: Camera, sceneManager: SceneManager) {
        super('frameRenderer', cameraManager)
        this._cameraManager = cameraManager
        const vd = gl.getParameter(gl.VIEWPORT)
        this._projection = new Matrix4().perspective({
            fovy: toRadians(70),
            aspect: window.innerWidth / window.innerHeight,
            near: 1,
            far: 1000
        })
        this._sceneManager = sceneManager
        this._framebuffer = gl.createFramebuffer()
        this._depthBuffer = gl.createRenderbuffer()
        this._texture = new Texture()
        this._texture.setWidth(Razor.CANVAS.width)
        this._texture.setHeight(Razor.CANVAS.height)
        this._texture.create()
        this._shader = ResourceManager.getShader('effect')
        this._shader.create();
        this._id = 0;
    }

    private getData(): Uint8Array {
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
        //   console.log(data);
        return data;
    }

    public render() {

        this.bind()
        this._shader.bind();
        this._shader.setInt('screenTexture', 0)
/*
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

*/
//        GLUtils.draw(10)
        this.unbind()

    }

    private bind() {
        gl.activeTexture(gl.TEXTURE0);
        
        this._texture.bind();
        this._texture.setData(this.getData());
        gl.viewport(0, 0, this._texture.getWidth(), this._texture.getHeight());

        gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);
        gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthBuffer);

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
            this._depthBuffer
        );

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //console.log(gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE)
    }

    private unbind() {
        //gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        //gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this._texture.unbind()
        gl.viewport(0, 0, Razor.CANVAS.width, Razor.CANVAS.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    public getTexture(): Texture {
        return this._texture;
    }
}

export default FrameRenderer;